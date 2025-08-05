import bcrypt from 'bcrypt';

const password = 'trusted123';

bcrypt.hash(password, 10, function (err, hash) {
  if (err) {
    console.error('Erreur :', err);
  } else {
    console.log('Mot de passe hashé :', hash);
  }
});

