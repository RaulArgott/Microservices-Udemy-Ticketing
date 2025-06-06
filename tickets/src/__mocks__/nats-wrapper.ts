export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation(
      (subject: string, data: string, callback: () => void) => {
        callback();
      }
    ),
  },
  connect: jest.fn().mockImplementation(
    (clusterId: string, clientId: string, url: string) => {
      return Promise.resolve();
    }
  ),
};
