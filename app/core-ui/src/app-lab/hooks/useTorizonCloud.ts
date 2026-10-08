import {
  deleteTorizonCloudCredentials,
  getTorizonCloudStatus,
  importTorizonCloudCredentials,
  provisionTorizonCloudDevice,
} from '@cloud-editor-mono/domain/src/services/services-by-app/app-lab';
import { UseTorizonCloudLogic } from '@cloud-editor-mono/ui-components/lib/components-by-app/app-lab';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { BoardScopedQuery } from '../boardScopedQuery';
import { useBoardLifecycleStore } from '../store/boardLifecycle';

const STATUS_REFRESH_INTERVAL = 60_000;

export const useTorizonCloud: UseTorizonCloudLogic = () => {
  const queryClient = useQueryClient();
  const boardIsReachable = useBoardLifecycleStore(
    (state) => state.boardIsReachable,
  );

  const { data: status } = useQuery(
    [BoardScopedQuery.TORIZON_CLOUD_STATUS],
    async () => getTorizonCloudStatus(),
    {
      enabled: boardIsReachable,
      retry: false,
      refetchInterval: STATUS_REFRESH_INTERVAL,
    },
  );

  const { mutate, isLoading, error } = useMutation({
    mutationFn: (action: () => Promise<unknown>) => action(),
    onSettled: () =>
      queryClient.invalidateQueries([BoardScopedQuery.TORIZON_CLOUD_STATUS]),
  });

  return {
    status,
    isLoading,
    error:
      error instanceof Error
        ? error.message
        : error
        ? String(error)
        : undefined,
    importCredentials: () => mutate(importTorizonCloudCredentials),
    provision: (name) => mutate(() => provisionTorizonCloudDevice(name)),
    disconnect: () => mutate(deleteTorizonCloudCredentials),
  };
};
