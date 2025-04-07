import { MdAccountCircle } from 'react-icons/md';
import { useCreatorContext } from 'src/contexts/CreatorContext';

export const CreatorImage = () => {
  const { creator } = useCreatorContext();

  if (creator === null) {
    return null;
  }

  const image = creator.highlightThumbUrl;

  return (
    <div className="h-8 w-8">
      {image === null ? (
        <MdAccountCircle className="text-gray-800" size={32} />
      ) : (
        <img className="h-full w-full rounded-full object-cover" src={image} />
      )}
    </div>
  );
};
