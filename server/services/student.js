const { v1: uuidV1 } = require('uuid');
const {
  student: StudentModel, sequelize,
} = require('../database');
const Helper = require('./../utils/helper');

const { getUser } = require('./auth');

const checkAuthorization = async (authorization) => {
  const parts = authorization.split(' ');

  const bearer = parts[0];

  const token = parts[1];

  if (bearer === 'Bearer') {
    const user = getUser(token);

    if (user.error) {
      return { errors: [ { name: 'Authentication', message: user.msg } ] };
    }

    return { user };
  }

  return { errors: [ { name: 'Authentication', message: 'Authentication must use Bearer' } ] };
};

const getList = async (payload, authorization) => {
  const {
    pageSize, pageNumber, filters, sorting,
  } = payload;

  if (authorization) {
    await checkAuthorization(authorization);
    const limit = pageSize;
    const offset = limit * (pageNumber - 1);
    const where = Helper.generateWhereCondition(filters);
    const order = Helper.generateOrderCondition(sorting);
    const attributes = [ 'public_id', 'mobile_number', 'email',
      'created_at', 'updated_at', 'last_name', 'first_name', 'meeting_time', 'address' ];

    const response = await sequelize.query(`SELECT ${attributes} FROM public.student ${where} ${order} OFFSET ${offset} LIMIT ${limit}`, {
      nest: true,
      type: sequelize.QueryTypes.SELECT,
    });

    if (response.length > 0) {
      const count = response.length;

      const doc = response.map((element) => Helper.convertSnakeToCamel(element));

      return { count, doc };
    }

    return { count: 0, doc: [] };
  }

  return { errors: [ { name: 'Authenticated', message: 'User must be authenticated' } ] };
};

const getDetailById = async (payload, authorization) => {
  const { publicId } = payload;

  if (authorization) {
    await checkAuthorization(authorization);

    const response = await StudentModel.findOne({
      where: { public_id: publicId },
    });

    if (response) {
      const { dataValues } = response;
      const doc = Helper.convertSnakeToCamel(dataValues);

      return { doc };
    }

    return { };
  }

  return { errors: [ { name: 'Authenticated', message: 'User must be authenticated' } ] };
};

const save = async (payload, authorization) => {
  const {
    mobileNumber, email, firstName, lastName, address, meetingTime,
  } = payload;

  const transaction = await sequelize.transaction();

  try {
    if (authorization) {
      await checkAuthorization(authorization);
      const isEmailExists = await StudentModel.findOne({ where: { email }, transaction });

      if (isEmailExists) {
        await transaction.rollback();

        return { errors: [ { name: 'email', message: 'duplicate entry.' } ] };
      }

      const publicId = uuidV1();

      await StudentModel.create({
        email,
        mobile_number: mobileNumber,
        first_name: firstName,
        last_name: lastName,
        address,
        meeting_time: meetingTime,
        public_id: publicId,
      }, { transaction });

      await transaction.commit();

      return { doc: { publicId } };
    }
    await transaction.rollback();

    return { errors: [ { name: 'Authenticated', message: 'User must be authenticated' } ] };
  } catch (error) {
    await transaction.rollback();

    return { errors: [ { name: 'email', message: 'transaction failed.' } ] };
  }
};

const patch = async (payload, authorization) => {
  const { publicId, ...data } = payload;
  const transaction = await sequelize.transaction();

  try {
    if (authorization) {
      await checkAuthorization(authorization);
      const response = await StudentModel.findOne({ where: { public_id: publicId }, transaction });

      if (response) {
        const doc = { ...Helper.convertCamelToSnake(data) };

        await StudentModel.update(doc, { where: { public_id: publicId }, transaction });
        await transaction.commit();

        return { doc: { publicId } };
      }
      await transaction.rollback();

      return { errors: [ { name: 'publicId', message: 'invalid publicId.' } ] };
    }
    await transaction.rollback();

    return { errors: [ { name: 'Authenticated', message: 'User must be authenticated' } ] };
  } catch (err) {
    await transaction.rollback();

    return { errors: [ { name: 'transaction', message: 'transaction failed.' } ] };
  }
};

const deleteStudent = async (payload, authorization) => {
  const { publicId } = payload;
  const transaction = await sequelize.transaction();

  try {
    if (authorization) {
      await checkAuthorization(authorization);
      const response = await StudentModel.findOne({ where: { public_id: publicId }, transaction });

      if (response) {
        await StudentModel.destroy({ where: { public_id: publicId }, transaction });
        await transaction.commit();

        return { doc: { publicId } };
      }
      await transaction.rollback();

      return { errors: [ { name: 'publicId', message: 'invalid publicId.' } ] };
    }
    await transaction.rollback();

    return { errors: [ { name: 'Authenticated', message: 'User must be authenticated' } ] };
  } catch (err) {
    await transaction.rollback();

    return { errors: [ { name: 'transaction', message: 'transaction failed.' } ] };
  }
};

module.exports = {
  getList,
  getDetailById,
  save,
  patch,
  deleteStudent,
};
