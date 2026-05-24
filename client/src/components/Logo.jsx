const sizes = {
  sm: 'h-8 w-8 text-sm rounded-xl',
  md: 'h-10 w-10 text-base rounded-2xl',
  lg: 'h-12 w-12 text-lg rounded-2xl',
};

const Logo = ({ size = 'md', className = '' }) => (
  <div
    className={`flex shrink-0 items-center justify-center bg-[#3B82C4] font-bold text-white ${sizes[size]} ${className}`}
    aria-hidden="true"
  >
    L
  </div>
);

export default Logo;
