import Link from "next/link";

type Props = {};

export default function UserNotSignedIn({}: Props) {
  return (
    <>
      <h1 className="font-bold self-center">
        Welcome to Tic Tac Toe game web app
      </h1>
      <p>
        To start playing, please{" "}
        <Link className="text-orange-400" href="/api/auth/signin">
          sign in{" "}
        </Link>
        with Google Oauth.
        <br />
        It is safe and does not share any private information with third-party
        apps such as this one{" "}
        <Link
          className="text-decoration-underline text-orange-400"
          href={
            "https://www.ramotion.com/blog/what-is-oauth-authentification/#:~:text=Defining%20OAuth,-sharing%20data%20between&text=It%20allows%20users%20to%20grant,an%20HTTP%20service%20through%20tokens."
          }
          target="_blank"
        >
          read more
        </Link>
        .
      </p>
    </>
  );
}
