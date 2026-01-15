import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization, OrganizationStatus } from '../entities/organization.entity';
import { OrganizationUser } from '../entities/organization-user.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(OrganizationUser)
    private organizationUserRepository: Repository<OrganizationUser>,
  ) {}

  async createOrganization(
    userId: number,
    name: string,
    description?: string,
    website?: string,
    email?: string,
    phone?: string,
    address?: string,
    logo?: string,
  ) {
    // Check if organization name already exists
    const existingOrg = await this.organizationRepository.findOne({
      where: { name },
    });

    if (existingOrg) {
      throw new BadRequestException('Organization name already exists');
    }

    // Create organization with PENDING status
    const organization = this.organizationRepository.create({
      name,
      description,
      website,
      email,
      phone,
      address,
      logo,
      status: OrganizationStatus.PENDING,
    });

    const savedOrganization = await this.organizationRepository.save(organization);

    // Create organization-user relationship (primary contact)
    const orgUser = this.organizationUserRepository.create({
      organizationId: savedOrganization.id,
      userId,
      isPrimary: true,
    });

    await this.organizationUserRepository.save(orgUser);

    return savedOrganization;
  }

  async verifyOrganization(
    organizationId: number,
    adminId: number,
    approved: boolean,
    rejectionReason?: string,
  ) {
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    organization.status = approved
      ? OrganizationStatus.APPROVED
      : OrganizationStatus.REJECTED;
    organization.verifiedAt = new Date();
    organization.verifiedBy = adminId;
    if (!approved && rejectionReason) {
      organization.rejectionReason = rejectionReason;
    }

    return await this.organizationRepository.save(organization);
  }

  async getUserOrganizations(userId: number) {
    const orgUsers = await this.organizationUserRepository.find({
      where: { userId },
      relations: ['organization'],
    });

    return orgUsers.map((orgUser) => orgUser.organization);
  }

  async getOrganizationById(id: number) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
      relations: ['organizationUsers', 'organizationUsers.user'],
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async getPendingOrganizations() {
    return await this.organizationRepository.find({
      where: { status: OrganizationStatus.PENDING },
      relations: ['organizationUsers', 'organizationUsers.user'],
      order: { createdAt: 'ASC' },
    });
  }

  async getAllOrganizations(status?: OrganizationStatus, search?: string) {
    const queryBuilder = this.organizationRepository.createQueryBuilder('organization')
      .leftJoinAndSelect('organization.organizationUsers', 'organizationUsers')
      .leftJoinAndSelect('organizationUsers.user', 'user');

    if (status) {
      queryBuilder.andWhere('organization.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(organization.name LIKE :search OR organization.description LIKE :search OR organization.email LIKE :search)',
        { search: `%${search}%` }
      );
    }

    return await queryBuilder
      .orderBy('organization.createdAt', 'DESC')
      .getMany();
  }

  async updateOrganization(
    organizationId: number,
    userId: number,
    updates: Partial<Organization>,
  ) {
    // Check if user is associated with the organization
    const orgUser = await this.organizationUserRepository.findOne({
      where: {
        organizationId,
        userId,
      },
    });

    if (!orgUser) {
      throw new BadRequestException('You are not authorized to update this organization');
    }

    // Check if organization is approved
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    if (organization.status !== OrganizationStatus.APPROVED) {
      throw new BadRequestException('Organization must be approved before updating');
    }

    // Update organization (excluding status and verification fields)
    const { status, verifiedAt, verifiedBy, rejectionReason, ...allowedUpdates } = updates;

    Object.assign(organization, allowedUpdates);
    return await this.organizationRepository.save(organization);
  }

  async deleteOrganization(organizationId: number) {
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    await this.organizationRepository.remove(organization);
  }
}

