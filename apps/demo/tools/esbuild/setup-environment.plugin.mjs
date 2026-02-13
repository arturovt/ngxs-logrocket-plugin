import crypto from 'node:crypto';

const password = '***';
const algorithm = 'aes-256-cbc';

const key = crypto.scryptSync(password, 'salt', 32);

const encrypted = 'f30a19bf0542501bd2926bdc7d2a237a';
const ivHex = 'f9e9cfea122a465f6867cffaddcc329c';

function decrypt() {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(ivHex, 'hex'),
  );
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export default {
  name: 'setup-environment',
  setup(build) {
    const define = (build.initialOptions.define ??= {});
    define.appId = JSON.stringify(decrypt());
  },
};
