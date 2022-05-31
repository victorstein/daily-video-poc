import { useMemo } from "react";
import Loader from '@custom/shared/components/Loader';

export const ShowWaitingMessage = ({ denied }) => {
  return (
    useMemo(() => {
      return (
        <div className="waiting">
          <Loader />
          {denied ? (
            <span>Call owner denied request</span>
          ) : (
            <span>Waiting for host to grant access</span>
          )}
          <style jsx>{`
            .waiting {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
    
            .waiting span {
              margin-left: var(--spacing-xxs);
            }
          `}</style>
        </div>
      );
    }, [denied])
  )
};