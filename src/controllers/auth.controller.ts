import { Response, Request, NextFunction } from "express";
import { ErrorResponse } from "../utils/error-response.utils";
import { IUser, User } from "../models/user.model";
import { sendEmail } from "../utils/email-sender.utils";
import crypto from "crypto";
import { RefreshToken } from "../models/refresh-token.model";
import moment from "moment-timezone";
import httpStatus from "http-status";
import bycrypt from "bcryptjs";
import {
  BODY_USER_CREATED_201,
  BODY_USER_EXIST,
  TITLE_ERROR,
  TITLE_USER_CREATED_201,
} from "../constants/messages.constants";
import { generateJWT } from "../helpers/generate-token.helper";
import { googleVerify } from "../helpers/google-verify.helper";
const belvo = require("belvo").default;

function generateTokenResponse(user: IUser, accessToken: any) {
  const tokenType = "Bearer";
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment()
    .add(2, "days")
    .toDate();
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  };
}

export async function register(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const emailExist: IUser | null = await User.findOne({ email });
    if (emailExist) {
      return res.status(httpStatus.CONFLICT).send({
        error: true,

        message: {
          title: TITLE_ERROR,
          message: BODY_USER_EXIST,
        },
        response: null,
      });
    }

    const user = await new User(req.body).save();
    const userTransformed = user.transform();
    // const token = generateTokenResponse(user, user.getSignedToken());
    const accessToken = await generateJWT(user.id);
    const token = generateTokenResponse(user, accessToken);
    let response = null;

    response = {
      token,
      user: userTransformed,
    };

    return res.status(201).send({
      error: false,
      message: {
        title: TITLE_USER_CREATED_201,
        message: BODY_USER_CREATED_201,
      },
      response,
    });
  } catch (error) {
    console.log("error ", error);
    return res.status(500).send({
      error: true,
      message: {
        title: TITLE_ERROR,
        message: error,
      },
      response: null,
    });
  }
}

export async function generateBelvoToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const client = new belvo(
      process.env.BELVO_SECRET_ID,
      process.env.BELVO_SECRET_PASSWORD,
      process.env.BELVO_ENV,
    );

    client.connect().then(function() {
      client.widgetToken
        .create()
        .then((response: any) => {
          res.json(response);
        })
        .catch((error: any) => {
          res.status(500).send({
            message: error.message,
          });
        });
    });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      error: true,
      message: {
        title: TITLE_ERROR,
        message: "Please provide a valid email and Password",
      },
      response: null,
    });
  }

  try {
    const user: IUser = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({
        error: true,
        message: {
          title: TITLE_ERROR,
          message: "Email incorrect.",
        },
        response: null,
      });
    }

    if (!user.active) {
      return res.status(400).send({
        error: true,
        message: {
          title: TITLE_ERROR,
          message: "User unavailable.",
        },
        response: null,
      });
    }

    const validPasswrod = bycrypt.compareSync(password, user.password);
    if (!validPasswrod) {
      return res.status(400).send({
        error: true,
        message: {
          title: TITLE_ERROR,
          message: "Password incorrect.",
        },
        response: null,
      });
    }
    const accessToken = await generateJWT(user.id);
    const token = generateTokenResponse(user, accessToken);

    // res.status(200).send(user);
    return res.status(200).send({
      error: false,
      message: {
        title: TITLE_USER_CREATED_201,
        message: "",
      },
      response: {
        user,
        token,
      },
    });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
}

export const googleSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id_token, role } = req.body;
    const { name, img, email } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    if (!user) {
      const data = {
        name,
        email,
        password: ":p",
        img,
        role,
        google: true,
      };
      user = new User(data);
      await user.save();
    }

    if (!user.active) {
      return res.status(401).json({
        ok: false,
        response: { message: `User disabled, please communicate with us.` },
      });
    }

    const token = await generateJWT(user.id);

    res.json({
      ok: true,
      response: {
        user,
        token,
      },
    });
  } catch (error) {
    return next(new ErrorResponse(error, 500));
  }
};

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { email } = req.body;

  try {
    const user: IUser | null = await User.findOne({ user: email });
    if (!user) {
      return next(new ErrorResponse("Email could not be sent", 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;
    const message = `
        <h1> You have requested a password reset </h1>
        <p> Please go to this link to reset your password </p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a> 
        `;
    try {
      await sendEmail({
        to: user.email,
        text: message,
        subject: message,
      });
      res.status(200).json({
        success: true,
        data: "Email Sent",
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { password } = req.body;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  try {
    const user: IUser | null = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid Reset Token", 400));
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(201).json({
      success: true,
      data: "Password Reset successful",
    });
  } catch (error) {
    next(error);
  }
}
