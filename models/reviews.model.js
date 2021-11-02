const db = require("../db/connection");

exports.selectReviews = (review_id) => {
  if (!/^[0-9]$/.test(review_id)) {
    return Promise.reject({
      statusCode: 404,
      msg: "Review does not exist with that ID",
    });
  }
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.comment_id)::INT AS comment_count 
      FROM reviews 
      LEFT JOIN comments ON comments.review_id = reviews.review_id 
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id`,
      [review_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          statusCode: 404,
          msg: "Review does not exist with that ID",
        });
      }
      return rows[0];
    });
};

exports.editReviews = (review_id, reqBody) => {
  const inc_votes = reqBody.inc_votes;

  if (!/^[0-9]$/.test(review_id)) {
    return Promise.reject({
      statusCode: 404,
      msg: "Review does not exist with that ID",
    });
  }
  if (!Object.keys(reqBody).includes("inc_votes")) {
    return Promise.reject({
      statusCode: 400,
      msg: "only inc_votes is allowed",
    });
  }
  if (typeof inc_votes !== "number") {
    return Promise.reject({
      statusCode: 400,
      msg: `inc_votes is required and must be a number`,
    });
  }
  return db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *`,
      [inc_votes, review_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          statusCode: 404,
          msg: "Review does not exist with that ID",
        });
      }
      return rows[0];
    });
};

exports.selectAllReviews = async (
  sortBy = "created_at",
  order = "desc",
  category
) => {
  if (!["created_at", "title", "votes"].includes(sortBy)) {
    return Promise.reject({ statusCode: 400, msg: "sort_by invalid" });
  }
  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ statusCode: 400, msg: "order invalid" });
  }

  let queryString = `
  SELECT reviews.* 
  FROM reviews 
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  `;
  const queryParams = [];
  if (category) {
    queryString += `WHERE category = $1\n`;
    queryParams.push(String(category));
  }
  queryString += `ORDER BY ${sortBy} ${order}`;

  const { rows } = await db.query(queryString, queryParams);
  if (rows.length === 0) {
    const isValidCategory = await db.query(
      "SELECT * FROM categories WHERE slug = $1",
      [category]
    );
    if (isValidCategory.rows.length === 0) {
      return Promise.reject({
        statusCode: 404,
        msg: "Review does not exist with this category",
      });
    }
  }
  return rows;
};

// return db.query(queryString, queryParams).then(({ rows }) => {
//   if (rows.length === 0) {
//     return db
//       .query("SELECT * FROM categories WHERE slug = $1", [category])
//       .then(({ rows }) => {
//         if (rows.length === 0) {
//           return Promise.reject({
//             statusCode: 404,
//             msg: "Review does not exist with this category",
//           });
//         }
//       });
//   }
//   console.log(rows)
//   return rows;
// });
