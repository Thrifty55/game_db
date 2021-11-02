const db = require("../connection");
const format = require("pg-format");

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => db.query(`DROP TABLE IF EXISTS reviews;`))
    .then(() => db.query(`DROP TABLE IF EXISTS users;`))
    .then(() => db.query(`DROP TABLE IF EXISTS categories;`))
    .then(() =>
      db.query(`
    CREATE TABLE categories (
      slug VARCHAR PRIMARY KEY,
      description VARCHAR NOT NULL
    );`)
    )
    .then(() =>
      db.query(`
      CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        avatar_url VARCHAR NOT NULL,
        name VARCHAR(255) NOT NULL
      );
      `)
    )
    .then(() =>
      db.query(`
    CREATE TABLE reviews (
      review_id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      review_body VARCHAR NOT NULL,
      designer VARCHAR NOT NULL,
      review_img_url VARCHAR NOT NULL DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      votes INT NOT NULL DEFAULT 0,
      category VARCHAR NOT NULL REFERENCES categories(slug),
      owner VARCHAR NOT NULL REFERENCES users(username),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `)
    )
    .then(() =>
      db.query(`
  CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    author VARCHAR NOT NULL REFERENCES users(username),
    review_id INT REFERENCES reviews(review_id),
    votes INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    body VARCHAR NOT NULL
  );
  `)
    )
    .then(() => {
      const categoriesString = format(
        `
    INSERT INTO categories
      (slug, description)
    VALUES %L
    RETURNING *;
    `,
        categoryData.map((category) => [category.slug, category.description])
      );
      return db.query(categoriesString);
    })
    .then(() => {
      const usersString = format(
        `
    INSERT INTO users
      (username, avatar_url, name)
    VALUES %L
    RETURNING *;
    `,
        userData.map((user) => [user.username, user.avatar_url, user.name])
      );
      return db.query(usersString);
    })
    .then(() => {
      const reviewsString = format(
        `
    INSERT INTO reviews
      (title, review_body, designer, review_img_url, votes, category, owner, created_at)
    VALUES %L
    `,
        reviewData.map(
          ({
            title,
            review_body,
            designer,
            review_img_url,
            votes,
            category,
            owner,
            created_at,
          }) => [
            title,
            review_body,
            designer,
            review_img_url,
            votes,
            category,
            owner,
            created_at,
          ]
        )
      );
      return db.query(reviewsString);
    })
    .then(() => {
      const commentsString = format(
        `
    INSERT INTO comments
      (author, review_id, votes, created_at, body)
    VALUES %L
    `,
        commentData.map(({ author, review_id, votes, created_at, body }) => [
          author,
          review_id,
          votes,
          created_at,
          body,
        ])
      );
      return db.query(commentsString);
    });
};

module.exports = seed;
