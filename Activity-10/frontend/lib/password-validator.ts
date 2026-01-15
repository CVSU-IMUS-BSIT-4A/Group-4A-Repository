export interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

export const passwordRequirements: PasswordRequirement[] = [
  {
    label: 'At least 8 characters long',
    test: (password: string) => password.length >= 8,
  },
  {
    label: 'Contains at least one uppercase letter',
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: 'Contains at least one lowercase letter',
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    label: 'Contains at least one numeric character',
    test: (password: string) => /[0-9]/.test(password),
  },
  {
    label: 'Contains at least one special character',
    test: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
  },
];

/**
 * Check if password meets all requirements
 */
export function validatePassword(password: string): {
  isValid: boolean;
  requirements: Array<{ label: string; met: boolean }>;
} {
  const requirements = passwordRequirements.map((req) => ({
    label: req.label,
    met: req.test(password),
  }));

  const isValid = requirements.every((req) => req.met);

  return {
    isValid,
    requirements,
  };
}

/**
 * Get password strength indicator
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length === 0) return 'weak';
  
  const validation = validatePassword(password);
  const metCount = validation.requirements.filter((r) => r.met).length;
  
  if (metCount === passwordRequirements.length) {
    return 'strong';
  } else if (metCount >= 3) {
    return 'medium';
  }
  
  return 'weak';
}

