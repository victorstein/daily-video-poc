import { useMemo } from "react";
import Loader from '@custom/shared/components/Loader';

export const ShowWaitingMessage = ({ denied }) => {
  return (
    useMemo(() => {
      return (
        <div className="waiting">
          <Loader />
          {denied ? (
            <h3>Call owner denied request</h3>
          ) : (
            <h2>Waiting for host to grant access</h2>
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