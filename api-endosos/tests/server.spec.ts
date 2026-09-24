jest.mock('../src/app');
jest.mock('../src/infrastructure/persistence/data-source');
jest.mock('../src/infrastructure/persistence/seed');
jest.mock('../src/infrastructure/secrets/vault-config.loader');

import { createApp } from '../src/app';
import { createDataSource } from '../src/infrastructure/persistence/data-source';
import { seedDemoTemplate } from '../src/infrastructure/persistence/seed';
import { loadSecrets } from '../src/infrastructure/secrets/vault-config.loader';
import { main } from '../src/server';

describe('server main()', () => {
  it('loads secrets, initializes the DataSource, seeds the demo template and starts the Hapi server', async () => {
    const fakeSecrets = { jwtSecret: 's', jwtIssuer: 'i', jwtAudience: 'a', postgresUrl: 'postgres://x' };
    (loadSecrets as jest.Mock).mockResolvedValue(fakeSecrets);
    const initialize = jest.fn().mockResolvedValue(undefined);
    const fakeDataSource = { initialize };
    (createDataSource as jest.Mock).mockReturnValue(fakeDataSource);
    (seedDemoTemplate as jest.Mock).mockResolvedValue(undefined);
    const start = jest.fn().mockResolvedValue(undefined);
    (createApp as jest.Mock).mockResolvedValue({ start, info: { uri: 'http://localhost:3001' } });

    await main();

    expect(initialize).toHaveBeenCalled();
    expect(seedDemoTemplate).toHaveBeenCalledWith(fakeDataSource);
    expect(start).toHaveBeenCalled();
  });
});
