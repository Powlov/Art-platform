// ============================================================================
// Art-OS Neo4j Data Load Script
// Generated: 2026-03-15T09:53:47.500527
// ============================================================================

// Create constraints and indexes
CREATE CONSTRAINT asset_id_unique IF NOT EXISTS FOR (a:Asset) REQUIRE a.id IS UNIQUE;
CREATE CONSTRAINT person_id_unique IF NOT EXISTS FOR (p:Person) REQUIRE p.id IS UNIQUE;
CREATE INDEX asset_category_idx IF NOT EXISTS FOR (a:Asset) ON (a.category);
CREATE INDEX person_role_idx IF NOT EXISTS FOR (p:Person) ON (p.role);

// Create nodes and relationships

CREATE (p:Person {
  id: '79d9951a-0db4-4baa-a589-64197a95f97c',
  email: 'admin@artbank.com',
  full_name: 'admin',
  role: 'admin',
  bio: '',
  created_at: datetime()
});

CREATE (p:Person {
  id: 'c7049384-11ea-4a7c-9021-0b5453675c57',
  email: 'artist@artbank.com',
  full_name: 'artist',
  role: 'artist',
  bio: '',
  created_at: datetime()
});

CREATE (p:Person {
  id: '4619aee8-b221-4c0b-98b0-ddb1c511e018',
  email: 'collector@artbank.com',
  full_name: 'collector',
  role: 'collector',
  bio: '',
  created_at: datetime()
});

CREATE (p:Person {
  id: '5a44e28e-fe96-45a5-815f-c242cb26b2ad',
  email: 'gallery@artbank.com',
  full_name: 'gallery',
  role: 'gallery',
  bio: '',
  created_at: datetime()
});

CREATE (p:Person {
  id: '60125e44-1c0d-4ced-9165-219a84e16fd1',
  email: 'curator@artbank.com',
  full_name: 'curator',
  role: 'curator',
  bio: '',
  created_at: datetime()
});

CREATE (p:Person {
  id: 'd030abe9-c17e-42ad-a27c-a1c82bd682a0',
  email: 'partner@artbank.com',
  full_name: 'partner',
  role: 'partner',
  bio: '',
  created_at: datetime()
});

CREATE (p:Person {
  id: 'b6bce7e9-6d2d-4691-9d06-f886e5eaac14',
  email: 'consultant@artbank.com',
  full_name: 'consultant',
  role: 'consultant',
  bio: '',
  created_at: datetime()
});

CREATE (p:Person {
  id: '1a1f878d-2708-4f83-8dcc-2238a398d472',
  email: 'user@artbank.com',
  full_name: 'user',
  role: 'guest',
  bio: '',
  created_at: datetime()
});

CREATE (a:Asset {
  id: '2801020b-fb6a-4787-aeaa-c618f89fe525',
  title: 'Sunset Over Mountains',
  description: 'A vibrant abstract representation of nature\'s beauty at dusk',
  category: 'painting',
  medium: 'unknown',
  year_created: 2024,
  current_price: 0,
  currency: 'USD',
  status: 'available',
  created_at: datetime()
});

CREATE (a:Asset {
  id: '04526ac2-f33d-4779-86fa-681e71006108',
  title: 'Urban Dreams',
  description: 'Modern cityscape with surrealist elements',
  category: 'painting',
  medium: 'unknown',
  year_created: 2024,
  current_price: 0,
  currency: 'USD',
  status: 'available',
  created_at: datetime()
});

CREATE (a:Asset {
  id: '9e33282e-34e7-4a7f-a584-7bd6c60cebb1',
  title: 'Whispers of the Sea',
  description: 'Serene ocean scene with dramatic lighting',
  category: 'painting',
  medium: 'unknown',
  year_created: 2024,
  current_price: 0,
  currency: 'USD',
  status: 'available',
  created_at: datetime()
});

CREATE (a:Asset {
  id: '24b93c0e-f659-43dd-a144-f23bb6d45625',
  title: 'Geometric Harmony',
  description: 'Contemporary exploration of form and color',
  category: 'painting',
  medium: 'unknown',
  year_created: 2024,
  current_price: 0,
  currency: 'USD',
  status: 'available',
  created_at: datetime()
});

CREATE (a:Asset {
  id: '94525f26-c11d-4ce3-954b-648e6d04a643',
  title: 'Portrait in Blue',
  description: 'Expressive portrait with bold color palette',
  category: 'painting',
  medium: 'unknown',
  year_created: 2024,
  current_price: 0,
  currency: 'USD',
  status: 'available',
  created_at: datetime()
});

CREATE (a:Asset {
  id: 'f57ec00a-11f1-4687-81f2-0de68417f3c3',
  title: 'Forest Meditation',
  description: 'Tranquil forest scene inviting contemplation',
  category: 'painting',
  medium: 'unknown',
  year_created: 2024,
  current_price: 0,
  currency: 'USD',
  status: 'available',
  created_at: datetime()
});

CREATE (a:Asset {
  id: 'c5a0638d-9464-431b-afed-8cb25f0362c1',
  title: 'Digital Cosmos',
  description: 'Futuristic vision of space and technology',
  category: 'painting',
  medium: 'unknown',
  year_created: 2024,
  current_price: 0,
  currency: 'USD',
  status: 'available',
  created_at: datetime()
});

CREATE (a:Asset {
  id: '85ddc61b-e324-499d-8b9c-9ee9d6d96969',
  title: 'Autumn Symphony',
  description: 'Vibrant celebration of fall colors',
  category: 'painting',
  medium: 'unknown',
  year_created: 2024,
  current_price: 0,
  currency: 'USD',
  status: 'available',
  created_at: datetime()
});

MATCH (a:Asset {id: '2801020b-fb6a-4787-aeaa-c618f89fe525'}), (p:Person {id: '79d9951a-0db4-4baa-a589-64197a95f97c'})
CREATE (a)-[:CREATED_BY {date: datetime()}]->(p);

MATCH (a:Asset {id: '04526ac2-f33d-4779-86fa-681e71006108'}), (p:Person {id: '79d9951a-0db4-4baa-a589-64197a95f97c'})
CREATE (a)-[:CREATED_BY {date: datetime()}]->(p);

MATCH (a:Asset {id: '9e33282e-34e7-4a7f-a584-7bd6c60cebb1'}), (p:Person {id: '79d9951a-0db4-4baa-a589-64197a95f97c'})
CREATE (a)-[:CREATED_BY {date: datetime()}]->(p);

MATCH (a:Asset {id: '24b93c0e-f659-43dd-a144-f23bb6d45625'}), (p:Person {id: '79d9951a-0db4-4baa-a589-64197a95f97c'})
CREATE (a)-[:CREATED_BY {date: datetime()}]->(p);

MATCH (a:Asset {id: '94525f26-c11d-4ce3-954b-648e6d04a643'}), (p:Person {id: '79d9951a-0db4-4baa-a589-64197a95f97c'})
CREATE (a)-[:CREATED_BY {date: datetime()}]->(p);

MATCH (a:Asset {id: 'f57ec00a-11f1-4687-81f2-0de68417f3c3'}), (p:Person {id: '79d9951a-0db4-4baa-a589-64197a95f97c'})
CREATE (a)-[:CREATED_BY {date: datetime()}]->(p);

MATCH (a:Asset {id: 'c5a0638d-9464-431b-afed-8cb25f0362c1'}), (p:Person {id: '79d9951a-0db4-4baa-a589-64197a95f97c'})
CREATE (a)-[:CREATED_BY {date: datetime()}]->(p);

MATCH (a:Asset {id: '85ddc61b-e324-499d-8b9c-9ee9d6d96969'}), (p:Person {id: '79d9951a-0db4-4baa-a589-64197a95f97c'})
CREATE (a)-[:CREATED_BY {date: datetime()}]->(p);

MATCH (a:Asset {id: '2801020b-fb6a-4787-aeaa-c618f89fe525'}), (p:Person {id: '79d9951a-0db4-4baa-a589-64197a95f97c'})
CREATE (a)-[:OWNED_BY {
  from: datetime('2026-03-15T09:52:55.658698'),
  price: 0.0,
  active: true
}]->(p);

MATCH (a:Asset {id: '04526ac2-f33d-4779-86fa-681e71006108'}), (p:Person {id: '79d9951a-0db4-4baa-a589-64197a95f97c'})
CREATE (a)-[:OWNED_BY {
  from: datetime('2026-03-15T09:52:55.659148'),
  price: 0.0,
  active: true
}]->(p);

MATCH (a:Asset {id: '9e33282e-34e7-4a7f-a584-7bd6c60cebb1'}), (p:Person {id: '79d9951a-0db4-4baa-a589-64197a95f97c'})
CREATE (a)-[:OWNED_BY {
  from: datetime('2026-03-15T09:52:55.659325'),
  price: 0.0,
  active: true
}]->(p);

MATCH (a:Asset {id: '24b93c0e-f659-43dd-a144-f23bb6d45625'}), (p:Person {id: '79d9951a-0db4-4baa-a589-64197a95f97c'})
CREATE (a)-[:OWNED_BY {
  from: datetime('2026-03-15T09:52:55.659472'),
  price: 0.0,
  active: true
}]->(p);

MATCH (a:Asset {id: '94525f26-c11d-4ce3-954b-648e6d04a643'}), (p:Person {id: '79d9951a-0db4-4baa-a589-64197a95f97c'})
CREATE (a)-[:OWNED_BY {
  from: datetime('2026-03-15T09:52:55.659622'),
  price: 0.0,
  active: true
}]->(p);

MATCH (a:Asset {id: 'f57ec00a-11f1-4687-81f2-0de68417f3c3'}), (p:Person {id: '79d9951a-0db4-4baa-a589-64197a95f97c'})
CREATE (a)-[:OWNED_BY {
  from: datetime('2026-03-15T09:52:55.659764'),
  price: 0.0,
  active: true
}]->(p);

MATCH (a:Asset {id: 'c5a0638d-9464-431b-afed-8cb25f0362c1'}), (p:Person {id: '79d9951a-0db4-4baa-a589-64197a95f97c'})
CREATE (a)-[:OWNED_BY {
  from: datetime('2026-03-15T09:52:55.659919'),
  price: 0.0,
  active: true
}]->(p);

MATCH (a:Asset {id: '85ddc61b-e324-499d-8b9c-9ee9d6d96969'}), (p:Person {id: '79d9951a-0db4-4baa-a589-64197a95f97c'})
CREATE (a)-[:OWNED_BY {
  from: datetime('2026-03-15T09:52:55.660061'),
  price: 0.0,
  active: true
}]->(p);

MATCH (a1:Asset {id: '2801020b-fb6a-4787-aeaa-c618f89fe525'}), (a2:Asset {id: '04526ac2-f33d-4779-86fa-681e71006108'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '2801020b-fb6a-4787-aeaa-c618f89fe525'}), (a2:Asset {id: '9e33282e-34e7-4a7f-a584-7bd6c60cebb1'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '2801020b-fb6a-4787-aeaa-c618f89fe525'}), (a2:Asset {id: '24b93c0e-f659-43dd-a144-f23bb6d45625'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '2801020b-fb6a-4787-aeaa-c618f89fe525'}), (a2:Asset {id: '94525f26-c11d-4ce3-954b-648e6d04a643'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '2801020b-fb6a-4787-aeaa-c618f89fe525'}), (a2:Asset {id: 'f57ec00a-11f1-4687-81f2-0de68417f3c3'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '2801020b-fb6a-4787-aeaa-c618f89fe525'}), (a2:Asset {id: 'c5a0638d-9464-431b-afed-8cb25f0362c1'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '2801020b-fb6a-4787-aeaa-c618f89fe525'}), (a2:Asset {id: '85ddc61b-e324-499d-8b9c-9ee9d6d96969'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '04526ac2-f33d-4779-86fa-681e71006108'}), (a2:Asset {id: '9e33282e-34e7-4a7f-a584-7bd6c60cebb1'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '04526ac2-f33d-4779-86fa-681e71006108'}), (a2:Asset {id: '24b93c0e-f659-43dd-a144-f23bb6d45625'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '04526ac2-f33d-4779-86fa-681e71006108'}), (a2:Asset {id: '94525f26-c11d-4ce3-954b-648e6d04a643'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '04526ac2-f33d-4779-86fa-681e71006108'}), (a2:Asset {id: 'f57ec00a-11f1-4687-81f2-0de68417f3c3'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '04526ac2-f33d-4779-86fa-681e71006108'}), (a2:Asset {id: 'c5a0638d-9464-431b-afed-8cb25f0362c1'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '04526ac2-f33d-4779-86fa-681e71006108'}), (a2:Asset {id: '85ddc61b-e324-499d-8b9c-9ee9d6d96969'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '9e33282e-34e7-4a7f-a584-7bd6c60cebb1'}), (a2:Asset {id: '24b93c0e-f659-43dd-a144-f23bb6d45625'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '9e33282e-34e7-4a7f-a584-7bd6c60cebb1'}), (a2:Asset {id: '94525f26-c11d-4ce3-954b-648e6d04a643'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '9e33282e-34e7-4a7f-a584-7bd6c60cebb1'}), (a2:Asset {id: 'f57ec00a-11f1-4687-81f2-0de68417f3c3'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '9e33282e-34e7-4a7f-a584-7bd6c60cebb1'}), (a2:Asset {id: 'c5a0638d-9464-431b-afed-8cb25f0362c1'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '9e33282e-34e7-4a7f-a584-7bd6c60cebb1'}), (a2:Asset {id: '85ddc61b-e324-499d-8b9c-9ee9d6d96969'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '24b93c0e-f659-43dd-a144-f23bb6d45625'}), (a2:Asset {id: '94525f26-c11d-4ce3-954b-648e6d04a643'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '24b93c0e-f659-43dd-a144-f23bb6d45625'}), (a2:Asset {id: 'f57ec00a-11f1-4687-81f2-0de68417f3c3'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '24b93c0e-f659-43dd-a144-f23bb6d45625'}), (a2:Asset {id: 'c5a0638d-9464-431b-afed-8cb25f0362c1'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '24b93c0e-f659-43dd-a144-f23bb6d45625'}), (a2:Asset {id: '85ddc61b-e324-499d-8b9c-9ee9d6d96969'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '94525f26-c11d-4ce3-954b-648e6d04a643'}), (a2:Asset {id: 'f57ec00a-11f1-4687-81f2-0de68417f3c3'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '94525f26-c11d-4ce3-954b-648e6d04a643'}), (a2:Asset {id: 'c5a0638d-9464-431b-afed-8cb25f0362c1'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: '94525f26-c11d-4ce3-954b-648e6d04a643'}), (a2:Asset {id: '85ddc61b-e324-499d-8b9c-9ee9d6d96969'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: 'f57ec00a-11f1-4687-81f2-0de68417f3c3'}), (a2:Asset {id: 'c5a0638d-9464-431b-afed-8cb25f0362c1'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: 'f57ec00a-11f1-4687-81f2-0de68417f3c3'}), (a2:Asset {id: '85ddc61b-e324-499d-8b9c-9ee9d6d96969'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);

MATCH (a1:Asset {id: 'c5a0638d-9464-431b-afed-8cb25f0362c1'}), (a2:Asset {id: '85ddc61b-e324-499d-8b9c-9ee9d6d96969'})
CREATE (a1)-[:SIMILAR_TO {score: 0.75, algorithm: 'category_match'}]->(a2);
