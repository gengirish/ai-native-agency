function success(res, data, statusCode = 200) {
  res.status(statusCode).json({ success: true, data });
}

function created(res, data) {
  res.status(201).json({ success: true, data });
}

function paginated(res, { data, total, page, limit }) {
  res.json({ success: true, data, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
}

function noContent(res) {
  res.status(204).send();
}

module.exports = { success, created, paginated, noContent };
