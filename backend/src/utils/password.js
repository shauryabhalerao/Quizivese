import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hashes a plaintext password using bcrypt with 10 salt rounds.
 * @param {string} password - Raw plaintext password
 * @returns {Promise<string>} Salted hash string
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * Compares a raw plaintext password against a stored bcrypt hash.
 * Constant-time comparison prevents timing attack vulnerabilities.
 * @param {string} candidatePassword - Plaintext password input
 * @param {string} hashedPassword - Stored hash from database
 * @returns {Promise<boolean>} True if match, false otherwise
 */
export const comparePassword = async (candidatePassword, hashedPassword) => {
  return bcrypt.compare(candidatePassword, hashedPassword);
};
