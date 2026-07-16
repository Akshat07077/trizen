type ImageBlockProps = {
  src: string;
  label: string;
};

export default function ImageBlock({ src, label }: ImageBlockProps) {
  return (
    <div className="img-ph has-photo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="toy-photo toy-photo-content" src={src} alt={label} />
    </div>
  );
}
