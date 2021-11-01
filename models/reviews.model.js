const db = require("../db/connection");

exports.selectReviews = (review_id) => {
    console.log(!/^[0-9]$/.test(review_id))

    if (!/^[0-9]$/.test(review_id)) {
        return Promise.reject({
          statusCode: 404,
          msg: "Review does not exist with that ID",
        });
      } 
      return db.query(`SELECT reviews.*, COUNT(comments.comment_id) AS comment_count 
      FROM reviews 
      LEFT JOIN comments ON comments.review_id = reviews.review_id 
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id`, [review_id])
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({
            statusCode: 404,
            msg: "Review does not exist with that ID",
          });
        }
        return rows[0];
      });
}