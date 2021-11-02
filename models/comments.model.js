const db = require("../db/connection");

exports.fetchCommentsGivenReview = (review_id) => {
  if (!/^[0-9]$/.test(review_id)) {
    return Promise.reject({
      statusCode: 404,
      msg: "Review does not exist with that ID",
    });
  }
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1", [review_id])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          statusCode: 404,
          msg: "Review does not exist with that ID",
        });
      }
    })
    .then(() => {
      return db
        .query(
          `SELECT comments.* FROM reviews 
        LEFT JOIN comments ON comments.review_id = reviews.review_id WHERE reviews.review_id = $1 GROUP BY comments.comment_id;`,
          [review_id]
        )
        .then(({ rows }) => {
          return rows[0];
        });
    });
};

exports.insertComment = (review_id, commentToInsert) => {
  const types = {
    author: "string",
    body: "string",
  };
  for (let [k, type] of Object.entries(types)) {
    if (typeof commentToInsert[k] !== type) {
      return Promise.reject({
        statusCode: 400,
        msg: `${k} is required and must be of type ${type}`,
      });
    }
  }

  if (!/^[0-9]$/.test(review_id)) {
    return Promise.reject({
      statusCode: 404,
      msg: "Review does not exist with that ID",
    });
  }

  return db
    .query(
      `
          INSERT INTO comments
            (author, body, review_id)
          VALUES
            ($1, $2, $3)
          RETURNING *;
          `,
      [commentToInsert.author, commentToInsert.body, review_id]
    )
    .then(({ rows }) => rows[0]);
};
