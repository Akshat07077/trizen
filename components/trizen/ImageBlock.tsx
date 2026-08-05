type ImageBlockProps = {
  src: string;
  label: string;
};

export default function ImageBlock({ src, label }: ImageBlockProps) {
  return (
    <figure className="source-image">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={label} />
    </figure>
  );
}
