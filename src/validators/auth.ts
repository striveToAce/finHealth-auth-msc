import { check } from 'express-validator';

export const validateLogin = [
  check('username')
    .notEmpty()
    .withMessage('Username is required'),

  check('password')
    .notEmpty()
    .withMessage('Password is required'),
];


export const validateSignup = [
    check('firstName')
      .notEmpty()
      .withMessage('First name is required'),
  
    check('lastName')
      .notEmpty()
      .withMessage('Last name is required'),
  
    check('username')
      .notEmpty()
      .withMessage('Username is required'),
  
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/\d/)
      .withMessage('Password must contain at least one number')
      .matches(/[\W_]/)
      .withMessage('Password must contain at least one special character'),
  ];
  