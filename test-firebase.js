// test-firebase.js
// Valida integração com Firebase ou simula caso não tenha credenciais

(async () => {
  try {
    const saBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    if (!saBase64) {
      console.log('FIREBASE_SERVICE_ACCOUNT_BASE64 não definido. Pulando testes reais do Firebase (modo simulado).');
      process.exit(0);
    }

    const saJson = Buffer.from(saBase64, 'base64').toString('utf8');
    const sa = JSON.parse(saJson);

    const admin = require('firebase-admin');
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(sa),
        projectId: sa.project_id
      });
    }

    const db = admin.firestore();
    const auth = admin.auth();

    // Teste simples: gravar documento
    const docRef = db.collection('ci_cd_tests').doc('test_doc');
    await docRef.set({ timestamp: new Date().toISOString(), ok: true });
    console.log('Documento gravado com sucesso no Firestore.');

    const users = await auth.listUsers(5);
    console.log('Usuários encontrados:', users.users.map(u => u.email));

    console.log('Testes Firebase concluídos com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('Erro nos testes Firebase:', err);
    process.exit(2);
  }
})();
