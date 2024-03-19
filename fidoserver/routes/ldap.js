// server.js
import express from 'express';
import ldap from 'ldapjs';

var router = express.Router();


// LDAP 連接配置
const ldapClient = ldap.createClient({
  url: 'ldap://140.125.32.66',
});

router.get('/' , (req, res) => {
    res.send('LDAP Client is on ');
})

// 登录验证端点
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // LDAP驗證
  ldapClient.bind(username, password, (err) => {
    if (err) {
      console.error('LDAP authentication failed:', err);
      return res.status(401).json({ message: 'Authentication failed' });
    }

    console.log('LDAP authentication successful');
    return res.status(200).json({ message: 'Authentication successful' });
  });
});

export default router ; 