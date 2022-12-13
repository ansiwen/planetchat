import React, { useEffect, useRef } from 'react';

import I18n from '../../i18n';
import { useAppSelector } from '../../lib/hooks';
import { getUserPresence } from '../../lib/methods';
import { isGroupChat } from '../../lib/methods/helpers';
import { formatDate } from '../../lib/methods/helpers/room';
import { IRoomItemContainerProps, ITouchableRef } from './interfaces';
import RoomItem from './RoomItem';
import { ROW_HEIGHT, ROW_HEIGHT_CONDENSED } from './styles';

export { ROW_HEIGHT, ROW_HEIGHT_CONDENSED };

const RoomItemContainer = ({
	item,
	id,
	onPress,
	onLongPress,
	toggleFav,
	toggleRead,
	hideChannel,
	isFocused,
	showLastMessage,
	username,
	useRealName,
	autoJoin,
	showAvatar,
	displayMode,
	getRoomTitle = () => 'title',
	getRoomAvatar = () => '',
	getIsRead = () => false,
	swipeEnabled = true
}: IRoomItemContainerProps): React.ReactElement => {
	const name = getRoomTitle(item);
	const testID = `rooms-list-view-item-${name}`;
	const avatar = getRoomAvatar(item);
	const isRead = getIsRead(item);
	const date = item.roomUpdatedAt && formatDate(item.roomUpdatedAt);
	const alert = item.alert || item.tunread?.length;
	const connected = useAppSelector(state => state.meteor.connected);
	const userStatus = useAppSelector(state => state.activeUsers[id || '']?.status);
	const isDirect = !!(item.t === 'd' && id && !isGroupChat(item));
	const touchableRef = useRef<ITouchableRef>(null);

	// When app reconnects, we need to fetch the rendered user's presence
	useEffect(() => {
		if (connected && isDirect) {
			getUserPresence(id);
		}
	}, [connected]);

	/**
	 * The component can be recycled by FlashList.
	 * When rid changes and there's no user's status, we need to fetch it
	 */
	useEffect(() => {
		if (!userStatus && isDirect) {
			getUserPresence(id);
		}

		// TODO: Remove this when we have a better way to close the swipeable
		touchableRef?.current?.close();
	}, [item.rid]);

	const handleOnPress = () => onPress(item);

	const handleOnLongPress = () => onLongPress && onLongPress(item);

	let accessibilityLabel = '';
	if (item.unread === 1) {
		accessibilityLabel = `, ${item.unread} ${I18n.t('alert')}`;
	} else if (item.unread > 1) {
		accessibilityLabel = `, ${item.unread} ${I18n.t('alerts')}`;
	}
	if (item.userMentions > 0) {
		accessibilityLabel = `, ${I18n.t('you_were_mentioned')}`;
	}
	if (date) {
		accessibilityLabel = `, ${I18n.t('last_message')} ${date}`;
	}

	const status = item.t === 'l' ? item.visitor?.status || item.v?.status : userStatus;

	return (
		<RoomItem
			touchableRef={touchableRef}
			name={name}
			avatar={avatar}
			isGroupChat={isGroupChat(item)}
			isRead={isRead}
			onPress={handleOnPress}
			onLongPress={handleOnLongPress}
			date={date}
			accessibilityLabel={accessibilityLabel}
			favorite={item.f}
			rid={item.rid}
			toggleFav={toggleFav}
			toggleRead={toggleRead}
			hideChannel={hideChannel}
			testID={testID}
			type={item.t}
			isFocused={isFocused}
			prid={item.prid}
			status={status}
			hideUnreadStatus={item.hideUnreadStatus}
			hideMentionStatus={item.hideMentionStatus}
			alert={alert}
			lastMessage={item.lastMessage}
			showLastMessage={showLastMessage}
			username={username}
			useRealName={useRealName}
			unread={item.unread}
			userMentions={item.userMentions}
			groupMentions={item.groupMentions}
			tunread={item.tunread}
			tunreadUser={item.tunreadUser}
			tunreadGroup={item.tunreadGroup}
			swipeEnabled={swipeEnabled}
			teamMain={item.teamMain}
			autoJoin={autoJoin}
			showAvatar={showAvatar}
			displayMode={displayMode}
			sourceType={item.source}
		/>
	);
};
export default RoomItemContainer;
