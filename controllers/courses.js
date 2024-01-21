const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Bootcamp = require('../models/Bootcamp');

exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampid) {
    const courses = await Course.find({ bootcamp: req.params.bootcampid });
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

exports.getSingleCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: course,
  });
});

exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampid;
  req.body.id = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampid);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with id ${req.params.bootcampid}`,
        404
      )
    );
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with id: ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
        404
      )
    );
  }

  const course = await Course.create(req.body);
  res.status(201).json({
    success: true,
    data: course,
  });
});

exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id ${req.params.id}`, 404)
    );
  }

  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with id: ${req.user.id} is not authorized to update a course to bootcamp ${course._id}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc     Delete all bootcamps
// @route    DELETE /api/v1/bootcamps/:id
// @access   Private

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id ${req.params.id}`, 404)
    );
  }

  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with id: ${req.user.id} is not authorized to delete a course to bootcamp ${course._id}`,
        404
      )
    );
  }

  await course.deleteOne();
  res.status(200).json({
    success: true,
    data: {},
  });
});
