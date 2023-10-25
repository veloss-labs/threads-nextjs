import Image from 'next/image';
import Link from 'next/link';

export default function Topbar() {
  return (
    <nav className="topbar">
      <Topbar.Left />

      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <div className="flex cursor-pointer">
            <Image
              src="/assets/logout.svg"
              alt="logout"
              width={24}
              height={24}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

Topbar.Left = function Item() {
  return (
    <Link href="/" className="flex items-center gap-4">
      <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
      <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
    </Link>
  );
};

Topbar.Right = function Item() {
  return (
    <div className="flex items-center gap-1">
      <div className="block md:hidden">
        <div className="flex cursor-pointer">
          <Image src="/assets/logout.svg" alt="logout" width={24} height={24} />
        </div>
      </div>
    </div>
  );
};
