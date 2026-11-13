const lastUser = store.get('pq_session', null);
if (lastUser && store.get('pq_users', {})[lastUser]) enter(lastUser);