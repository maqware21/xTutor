const { supabase } = require('../config/supa');

class authenticator {
  superAdminAuthenticator = async (req, resp) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];
      if (token === undefined) {
        resp.status(401).send({ message: 'Unauthorized' });
      } else {
        const { data, error } = await supabase.auth.getUser(token);
        const { data: userData, error: isError } = await supabase
          .from('users')
          .select('*')
          .eq('email', data?.user?.email);

        if (error) {
          return resp.status(401).send({ message: error?.message });
        }

        return userData;
      }
    } catch (error) {
      resp.status(401).send({ message: 'Unauthorized' });
    }
  };
}

const Authenticator = new authenticator();

module.exports = Authenticator;
