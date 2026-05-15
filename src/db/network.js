import os from 'os';


export const getIPv4 = () => {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // IPv4 va tashqi (internal emas) manzil
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }

  return 'localhost';
};


export const getNetworkURL = (port = 8000) => {
  const ip = getIPv4();
  return `http://${ip}:${port}`;
};

export const getNetworkInfo = (port = 8000) => {
  const ip = getIPv4();
  return {
    local: `http://localhost:${port}`,
    network: `http://${ip}:${port}`,
    ip: ip,
    port: port
  };
};