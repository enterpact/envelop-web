import Record from './records/record';
import GaiaDocument from './gaia_document';

function mockSession(session) {
  Record.config({ session });
}

const legacyDocument = {
  id: '123',
  url: 'abcdef/name.pdf',
  size: 500,
  created_at: '2019-07-16T10:47:39.865Z',
  num_parts: 2,
  uploaded: true
}

describe('.get', () => {
  test('interprets legacy documents', async () => {
    mockSession({ getFile: async() => JSON.stringify(legacyDocument) })

    const doc = await GaiaDocument.get('123');

    expect(doc.filePath).toBe('abcdef/name.pdf');
    expect(doc.fileSize).toBe(500);
    expect(doc.createdAt).toEqual(new Date('2019-07-16T10:47:39.865Z'));
    expect(doc.numParts).toBe(2);
    expect(doc.uploaded).toBe(true);
  });
});

describe('.fromGaiaIndex', () => {
  test('interprets legacy documents from GaiaIndex', async () => {
    const doc = await GaiaDocument.fromGaiaIndex(legacyDocument);

    expect(doc.filePath).toBe('abcdef/name.pdf');
    expect(doc.fileSize).toBe(500);
    expect(doc.createdAt).toEqual(new Date('2019-07-16T10:47:39.865Z'));
    expect(doc.numParts).toBe(2);
    expect(doc.uploaded).toBe(true);
  });
});

describe('.save', () => {
  test('sets file path', async () => {
    const docAttributes = {
      createdAt: new Date(),
      fileName: 'name.pdf',
      fileSize: 500,
      file: new File([1], 'name.pdf')
    }

    mockSession({
      putFile: async() => true,
      getFile: async() => JSON.stringify(docAttributes)
    });

    const doc = new GaiaDocument(docAttributes);
    await doc.save()

    expect(doc.filePath).toMatch(/.*\/name\.pdf$/);
  });
});

describe('.serialize', () => {
  test('serializes attributes', async () => {
    mockSession({ getFile: async() => JSON.stringify(legacyDocument) })

    const doc = await GaiaDocument.get('123');
    const serialized = doc.serialize();

    expect(serialized.id).toBe('123');
    expect(serialized.filePath).toBe('abcdef/name.pdf');
    expect(serialized.fileSize).toBe(500);
    expect(serialized.createdAt).toEqual(new Date('2019-07-16T10:47:39.865Z'));
    expect(serialized.numParts).toBe(2);
  });

  test('serializes legacy attributes', async () => {
    mockSession({ getFile: async() => JSON.stringify(legacyDocument) })

    const doc = await GaiaDocument.get('123');
    const serialized = doc.serialize();

    expect(serialized.url).toBe('abcdef/name.pdf');
    expect(serialized.size).toBe(500);
    expect(serialized.created_at).toEqual(new Date('2019-07-16T10:47:39.865Z'));
    expect(serialized.num_parts).toBe(2);
    expect(serialized.uploaded).toBe(true);
  });
});
