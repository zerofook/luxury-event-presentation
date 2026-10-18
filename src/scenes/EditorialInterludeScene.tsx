import type { EditorialInterludeSceneData } from '@/content/types';

interface Props {
  data: EditorialInterludeSceneData;
}

export function EditorialInterludeScene({ data }: Props) {
  return (
    <section id={`scene-${data.id}`} className="journey-interlude" aria-label={data.headlineBg}>
      <div className="journey-interlude__line" aria-hidden="true" />
      <h2 className="journey-interlude__headline">{data.headlineBg}</h2>
      {data.sublineBg && <p className="journey-interlude__sub">{data.sublineBg}</p>}
    </section>
  );
}
