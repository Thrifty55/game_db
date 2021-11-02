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
    })
  };