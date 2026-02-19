import coatiInTree from '@/modules/home/assets/coati-in-tree.png';
import coatiStanding from '@/modules/home/assets/coati-standing.png';
import Image from 'next/image';

export function MainHeading() {
  return (
    <h1>
      <span className="sr-only">CoatiQuati</span>
      <div
        aria-hidden
        className="grid grid-cols-6 gap-0 text-[5rem] md:text-[12rem] font-black leading-none text-center"
      >
        <span>C</span>
        <span>o</span>
        <span>a</span>
        <span>t</span>
        <span>i</span>
        <span className="relative">
          <div className="overflow-clip rounded-[90px] rounded-b-3xl w-full h-full relative">
            <Image
              src={coatiStanding}
              alt="coati standing"
              title="Coatis de pé"
              className="filter saturate-150 hue-rotate-[20deg] absolute bg-center  object-cover object-[-5px] scale-110"
            />
          </div>
        </span>
        <span className="col-span-2 relative">
          <div className="overflow-clip rounded-[90px] rounded-br-3xl w-full h-full relative">
            <Image
              src={coatiInTree}
              alt="coati in a tree"
              title="Coatis na árvore"
              fill
              className="filter saturate-150 hue-rotate-[10deg]"
            />
          </div>
          <span className="w-[30px] h-[70px] bg-gradient-to-b from-purple-100/15 border border-white/20 to-green-600 absolute rounded-lg -bottom-[35px] -right-[15px] -rotate-45" />
        </span>
        <span>u</span>
        <span>a</span>
        <span>t</span>
        <span>i</span>
      </div>
    </h1>
  );
}
