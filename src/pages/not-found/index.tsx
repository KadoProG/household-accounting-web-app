import { type FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: FC = () => {
  const navigate = useNavigate();

  const handleGoBack = useCallback(() => {
    navigate(-1); // 1つ前のページに戻る
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-3xl">Not Found</h1>
        <p>お探しのページは見つかりませんでした。</p>
        <div>
          <button
            onClick={handleGoBack}
            className="cursor-pointer rounded p-4 text-left text-xl transition hover:bg-bg-base-hover dark:hover:bg-bg-base-hover-dark"
          >
            前のページに戻る
          </button>
        </div>
      </div>
    </div>
  );
};
