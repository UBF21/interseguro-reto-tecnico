import { DataSource } from 'typeorm';
import { createDataSource } from '../../../src/infrastructure/persistence/data-source';

describe('createDataSource', () => {
  it('builds a postgres DataSource with the given connection url', () => {
    const dataSource = createDataSource('postgres://user:pass@localhost:5432/db');

    expect(dataSource).toBeInstanceOf(DataSource);
    expect(dataSource.options.type).toBe('postgres');
  });
});
