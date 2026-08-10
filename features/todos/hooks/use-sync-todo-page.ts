"use client";

import { useEffect, useEffectEvent } from "react";

export function useSyncTodoPage(
	isSuccess: boolean,
	page: number,
	requestedPage: number,
	setPage: (page: number) => Promise<URLSearchParams>,
) {
	const syncPage = useEffectEvent(setPage);

	// Filtering or deleting tasks can make the requested page out of range.
	useEffect(() => {
		if (!isSuccess || page === requestedPage) return;
		void syncPage(page);
	}, [isSuccess, page, requestedPage]);
}
