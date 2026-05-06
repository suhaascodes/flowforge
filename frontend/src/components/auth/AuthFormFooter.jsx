import { Link } from 'react-router-dom';

export default function AuthFormFooter({ text, linkText, to }) {
  return (
    <p className="text-center text-sm text-slate-300">
      {text}{' '}
      <Link to={to} className="font-semibold text-cyan-300 transition hover:text-cyan-200">
        {linkText}
      </Link>
    </p>
  );
}