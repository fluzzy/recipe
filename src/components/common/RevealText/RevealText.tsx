interface RevealTextProps {
  text: string;
}

export function RevealText({ text }: RevealTextProps) {
  return (
    <>
      <div className='overflow-hidden text-xl leading-6 font-bold text-white'>
        {text.match(/./gu)!.map((char, index) => (
          <span
            className='animate-text-reveal inline-block [animation-fill-mode:backwards]'
            key={`${char}-${index}`}
            style={{
              animationDelay: `${index * 0.05}s`,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    </>
  );
}
