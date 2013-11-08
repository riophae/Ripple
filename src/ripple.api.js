/**
 * Twtter API Version 1.0
 * https://dev.twitter.com/docs/api/1.1
 *
 * @lastModified 		2013/11/4 09:37
 */


(function(R) {

	R.config({
		baseAPIUrl: 'https://api.twitter.com/1.1/',
		OAuthVersion: '1.0',
		htmlMode: true, // status 以 HTML 格式返回
		liteMode: true // status 对象不含有 profile 信息
	});

	var H = R.helpers,
			E = R.events,
			G = R.getConfig,
			N = R.registerAPI;

	function completeTweetParams(params) {
		params = params || {};
		if (G('liteMode')) {
			params.mode = params.mode || 'lite';
		}
		if (G('htmlMode')) {
			params.format = params.format || 'html';
		}
		return params;
	}

	function processTweet(event_type, status) {
		var event = { actionType: event_type };
		status = E.triggerWith(this, 'process_status', status, event);
		status = E.triggerWith(this, event_type, status, event);
		return status;
	}

	function processTweets(event_type, statuses) {
		for (var i = 0, len = statuses.length; i < len; i++) {
			statuses[i] = processTweet.call(this, event_type, statuses[i]);
		}
		return statuses;
	}

	function _processTweet(status, event) {
		return processTweet.call(this, event.actionType, status);
	}

	function _processTweets(statuses, event) {
		return processTweets.call(this, event.actionType, statuses);
	}

	function idReplacer(url, params) {
		return url.replace('{:id}', params.id);
	}


	/* Timelines */

	// https://dev.twitter.com/docs/api/1.1/get/statuses/mentions_timeline
	N({
		name: 'getMentions',
		action: 'statuses/mentions_timeline',
		method: 'GET',
		argsProcessor: completeTweetParams
	}, { success: _processTweets });

	// https://dev.twitter.com/docs/api/1.1/get/statuses/user_timeline
	N({
		name: 'getUserTimeline',
		action: 'statuses/user_timeline',
		method: 'GET',
		argsProcessor: completeTweetParams
	}, { success: _processTweets });

	// https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
	N({
		name: 'getHomeTimeline',
		action: 'statuses/home_timeline',
		method: 'GET',
		argsProcessor: completeTweetParams
	}, { success: _processTweets });

	// https://dev.twitter.com/docs/api/1.1/get/statuses/retweets_of_me
	N({
		name: 'getRetweetsOfMe',
		action: 'statuses/retweets_of_me',
		method: 'GET',
		argsProcessor: completeTweetParams
	}, { success: _processTweets });


	/* Tweets */

	// https://dev.twitter.com/docs/api/1.1/get/statuses/retweets/%3Aid
	N({
		name: 'getRetweets',
		action: 'statuses/retweets/{:id}',
		method: 'GET',
		argsProcessor: completeTweetParams,
		urlProcessor: idReplacer
	}, { success: _processTweets });

	// https://dev.twitter.com/docs/api/1.1/get/statuses/show/%3Aid
	N({
		name: 'showTweet',
		action: 'statuses/show.json',
		method: 'GET',
		argsProcessor: completeTweetParams
	}, { success: _processTweet });

	// https://dev.twitter.com/docs/api/1.1/post/statuses/destroy/%3Aid
	N({
		name: 'destroyTweet',
		action: 'statuses/destroy/{:id}',
		method: 'POST',
		argsProcessor: completeTweetParams,
		urlProcessor: idReplacer
	}, { success: _processTweet });

	// https://dev.twitter.com/docs/api/1.1/post/statuses/update
	N({
		name: 'postTweet',
		action: 'statuses/update.json',
		method: 'POST',
		argsProcessor: completeTweetParams
	}, { success: _processTweet });

	// https://dev.twitter.com/docs/api/1.1/post/statuses/retweet/%3Aid
	N({
		name: 'retweet',
		action: 'statuses/retweet/{:id}.json',
		method: 'POST',
		argsProcessor: completeTweetParams,
		urlProcessor: idReplacer
	}, { success: _processTweet });

	// https://dev.twitter.com/docs/api/1.1/post/statuses/update_with_media
	N({
		name: 'uploadPhoto',
		action: 'statuses/update_with_media',
		method: 'POST',
		argsProcessor: completeTweetParams
	}, { success: _processTweet });

	// https://dev.twitter.com/docs/api/1.1/get/statuses/oembed
	N({
		name: 'getOEmbed',
		action: 'statuses/oembed',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/statuses/retweeters/ids
	N({
		name: 'getRetweetersIds',
		action: 'statuses/retweeters/ids',
		method: 'GET'
	});


	/* Search */

	// https://dev.twitter.com/docs/api/1.1/get/search/tweets
	N({
		name: 'searchTweets',
		action: 'search/tweets',
		method: 'GET',
		argsProcessor: completeTweetParams
	}, { success: _processTweets });


	/* Streaming */

	// https://dev.twitter.com/docs/api/1.1/post/statuses/filter
	N({
		name: 'filter',
		action: 'statuses/filter',
		baseAPIUrl: 'https://stream.twitter.com/1.1/',
		method: 'POST'
	}, { success: _processTweets });

	// https://dev.twitter.com/docs/api/1.1/get/statuses/sample
	N({
		name: 'getSample',
		action: 'statuses/sample',
		baseAPIUrl: 'https://stream.twitter.com/1.1/',
		method: 'POST'
	}, { success: _processTweets });

	// https://dev.twitter.com/docs/api/1.1/get/statuses/firehose
	N({
		name: 'getFirehose',
		action: 'statuses/firehose',
		baseAPIUrl: 'https://stream.twitter.com/1.1/',
		method: 'POST'
	}, { success: _processTweets });

	// https://dev.twitter.com/docs/api/1.1/get/user
	N({
		name: 'getUserStream',
		action: 'user',
		baseAPIUrl: 'https://userstream.twitter.com/1.1/',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/get/site
	N({
		name: 'getSiteStream',
		action: 'site',
		baseAPIUrl: 'https://sitestream.twitter.com/1.1/',
		method: 'POST'
	});


	/* Direct Messages */

	// https://dev.twitter.com/docs/api/1.1/get/direct_messages
	N({
		name: 'getDirectMessages',
		action: 'direct_messages',
		method: 'GET',
		argsProcessor: completeTweetParams
	});

	// https://dev.twitter.com/docs/api/1.1/get/direct_messages/sent
	N({
		name: 'getSentDirectMessages',
		action: 'direct_messages/sent',
		method: 'GET',
		argsProcessor: completeTweetParams
	});

	// https://dev.twitter.com/docs/api/1.1/get/direct_messages/show
	N({
		name: 'showDirectMessage',
		action: 'direct_messages/show',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/post/direct_messages/destroy
	N({
		name: 'destroyDirectMessage',
		action: 'direct_messages/destroy',
		method: 'POST',
		argsProcessor: completeTweetParams
	});

	// https://dev.twitter.com/docs/api/1.1/post/direct_messages/new
	N({
		name: 'createDirectMessage',
		action: 'direct_messages/new',
		method: 'POST'
	});


	/* Friends & Followers */

	// https://dev.twitter.com/docs/api/1.1/get/friendships/no_retweets/ids
	N({
		name: 'getNoRetweetsIds',
		action: 'friendships/no_retweets/ids',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/friends/ids
	N({
		name: 'getFriendsIds',
		action: 'friends/ids',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/followers/ids
	N({
		name: 'getFollowersIds',
		action: 'followers/ids',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/friendships/lookup
	N({
		name: 'lookupFriendship',
		action: 'friendships/lookup',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/friendships/incoming
	N({
		name: 'getIncomingFriendships',
		action: 'friendships/incoming',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/friendships/outgoing
	N({
		name: 'getOutgoingFriendships',
		action: 'friendships/outgoing',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/post/friendships/create
	N({
		name: 'follow',
		action: 'friendships/create',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/post/friendships/destroy
	N({
		name: 'unfollow',
		action: 'friendships/destroy',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/post/friendships/update
	N({
		name: 'updateFriendship',
		action: 'friendships/update',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/get/friendships/show
	N({
		name: 'showFriendship',
		action: 'friendships/show',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/friends/list
	N({
		name: 'getFriends',
		action: 'friends/list',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/followers/list
	N({
		name: 'getFollowers',
		action: 'followers/list',
		method: 'GET'
	});


	/* Users */

	// https://dev.twitter.com/docs/api/1.1/get/account/settings
	N({
		name: 'getSettings',
		action: 'account/settings',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/account/verify_credentials
	N({
		name: 'verify',
		action: 'account/verify_credentials',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/post/account/settings
	N({
		name: 'updateSettings',
		action: 'account/settings',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/post/account/update_delivery_device
	N({
		name: 'updateDeliveryDevice',
		action: 'account/update_delivery_device',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/post/account/update_profile
	N({
		name: 'updateProfile',
		action: 'account/update_profile',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/post/account/update_profile_background_image
	N({
		name: 'updateProfileBackgroundImage',
		action: 'account/update_profile_background_image',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/post/account/update_profile_colors
	N({
		name: 'updateProfileColors',
		action: 'account/update_profile_colors',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/post/account/update_profile_image
	N({
		name: 'updateProfileImage',
		action: 'account/update_profile_image',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/get/blocks/list
	N({
		name: 'getBlockedUsers',
		action: 'blocks/list',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/blocks/ids
	N({
		name: 'getBlockedUsersIds',
		action: 'blocks/ids',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/post/blocks/create
	N({
		name: 'block',
		action: 'blocks/create',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/post/blocks/destroy
	N({
		name: 'unblock',
		action: 'blocks/destroy',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/get/users/lookup
	N({
		name: 'getUsers',
		action: 'users/lookup',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/users/show
	N({
		name: 'getUser',
		action: 'users/show',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/users/search
	N({
		name: 'searchUsers',
		action: 'users/search',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/users/contributees
	N({
		name: 'getContributees',
		action: 'users/contributees',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/users/contributors
	N({
		name: 'getContributors',
		action: 'users/contributors',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/post/account/remove_profile_banner
	N({
		name: 'removeProfileBanner',
		action: 'account/remove_profile_banner',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/post/account/update_profile_banner
	N({
		name: 'updateProfileBanner',
		action: 'account/update_profile_banner',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/get/users/profile_banner
	N({
		name: 'getProfileBanner',
		action: 'users/profile_banner',
		method: 'GET'
	});


	/* Suggested Users */

	// https://dev.twitter.com/docs/api/1.1/get/users/suggestions/%3Aslug
	N({
		name: 'getSuggestedUsersBySlug',
		action: 'users/suggestions/{:slug}',
		method: 'GET',
		urlProcessor: function(url, params) {
			return url.replace('{:slug}', params.slug);
		}
	});

	// https://dev.twitter.com/docs/api/1.1/get/users/suggestions
	N({
		name: 'getSuggestedUsers',
		action: 'users/suggestions',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/users/suggestions/%3Aslug/members
	N({
		name: 'getSuggestedUsersWithTweetsBySlug',
		action: 'users/suggestions/:slug/members',
		method: 'GET',
		urlProcessor: function(url, params) {
			return url.replace('{:slug}', params.slug);
		}
	});


	/* Favorites */

	// https://dev.twitter.com/docs/api/1.1/get/favorites/list
	N({
		name: 'getFavoritedTweets',
		action: 'favorites/list',
		method: 'GET',
		argsProcessor: completeTweetParams
	}, { success: _processTweets });

	// https://dev.twitter.com/docs/api/1.1/post/favorites/destroy
	N({
		name: 'unfavorite',
		action: 'favorites/destroy',
		method: 'POST',
		argsProcessor: completeTweetParams
	}, { success: _processTweet });

	// https://dev.twitter.com/docs/api/1.1/post/favorites/create
	N({
		name: 'favorite',
		action: 'favorites/create',
		method: 'POST',
		argsProcessor: completeTweetParams
	}, { success: _processTweet });


	/* Lists */

	// https://dev.twitter.com/docs/api/1.1/get/lists/list
	N({
		name: 'getListsList',
		action: 'lists/list',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/lists/statuses
	N({
		name: 'getListTweets',
		action: 'lists/statuses',
		method: 'GET',
		argsProcessor: completeTweetParams
	}, { success: _processTweets });


	/* Saved Searches */


	/* Places & Geo */


	/* Trends */


	/* Spam Reporting */


	/* Help */


	/* Statuses */

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/statuses.update
	N({
		name: 'postStatus',
		action: 'statuses/update',
		method: 'POST',
		argsProcessor: completeTweetParams
	}, { success: _processTweet });

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/statuses.destroy
	N({
		name: 'destroyStatus',
		action: 'statuses/destroy',
		method: 'POST',
		argsProcessor: completeTweetParams
	}, { success: _processTweet });

	N({
		name: 'replyStatus',
		packer: function(params) {
			var reply = {
				status: params.status,
				in_reply_to_status_id: params.statusId,
				in_reply_to_user_id: params.userId
			};
			var ajax_options = {
				success: function(status) {
					return processTweet('reply_status', status);
				}
			};
			return this.postStatus(reply).setupAjax(ajax_options);
		}
	});

	N({
		name: 'repostStatus',
		packer: function(params) {
			var repost = {
				status: params.status,
				repost_status_id: params.statusId
			};
			var ajax_options = {
				success: function(status) {
					return processTweet('repost_status', status);
				}
			};
			return this.postStatus(repost).setupAjax(ajax_options);
		}
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/statuses.show
	N({
		name: 'showStatus',
		action: 'statuses/show',
		method: 'GET',
		argsProcessor: completeTweetParams
	}, { success: _processTweet });

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/statuses.mentions
	N({
		name: 'getMentions',
		action: 'statuses/mentions',
		method: 'GET',
		argsProcessor: completeTweetParams
	}, { success: _processTweets });

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/statuses.replies
	N({
		name: 'getReplies',
		action: 'statuses/replies',
		method: 'GET',
		argsProcessor: completeTweetParams
	}, { success: _processTweets });

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/statuses.home-timeline
	N({
		name: 'getHomeTimeline',
		action: 'statuses/home_timeline',
		method: 'GET',
		argsProcessor: completeTweetParams
	}, { success: _processTweets });

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/statuses.user-timeline
	N({
		name: 'getUserTimeline',
		action: 'statuses/user_timeline',
		method: 'GET',
		argsProcessor: completeTweetParams
	}, { success: _processTweets });

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/statuses.context-timeline
	N({
		name: 'getContextTimeline',
		action: 'statuses/context_timeline',
		method: 'GET',
		argsProcessor: completeTweetParams
	}, { success: _processTweets });

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/statuses.public-timeline
	N({
		name: 'getPublicTimeline',
		action: 'statuses/public_timeline',
		method: 'GET',
		argsProcessor: completeTweetParams
	}, { success: _processTweets });

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/statuses.friends
	N({
		name: 'getFriendList',
		action: 'statuses/friends',
		method: 'GET',
		argsProcessor: completeTweetParams
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/statuses.followers
	N({
		name: 'getFollowerList',
		action: 'statuses/followers',
		method: 'GET',
		argsProcessor: completeTweetParams
	});


	/* Photos */

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/photos.upload
	N({
		name: 'postPhoto',
		action: 'photos/upload',
		method: 'POST',
		argsProcessor: completeTweetParams
	}, {
		urlEncoded: false,
		success: _processTweet
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/photos.user-timeline
	N({
		name: 'getPhotoTimeline',
		action: 'photos/user_timeline',
		method: 'GET',
		argsProcessor: completeTweetParams
	}, { success: _processTweets });


	/* Direct Messages */

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/direct-messages.new
	N({
		name: 'postDirectMessage',
		action: 'direct_messages/new',
		method: 'POST',
		argsProcessor: completeTweetParams
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/direct-messages.destroy
	N({
		name: 'destroyDirectMessage',
		action: 'direct_messages/destroy',
		method: 'POST'
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/direct-messages.inbox
	N({
		name: 'showInbox',
		action: 'direct_messages/inbox',
		method: 'GET',
		argsProcessor: completeTweetParams
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/direct-messages.sent
	N({
		name: 'showOutbox',
		action: 'direct_messages/sent',
		method: 'GET',
		argsProcessor: completeTweetParams
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/direct-messages.conversation
	N({
		name: 'showDirectMessageConversation',
		action: 'direct_messages/conversation',
		method: 'GET',
		argsProcessor: completeTweetParams
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/direct-messages.conversation-list
	N({
		name: 'getDirectMessageConversationList',
		action: 'direct_messages/conversation_list',
		method: 'GET',
		argsProcessor: completeTweetParams
	});


	/* Friends */

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/friends.ids
	N({
		name: 'getFriendIdList',
		action: 'friends/ids',
		method: 'GET'
	});


	/* Followers */

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/followers.ids
	N({
		name: 'getFollowerIdList',
		action: 'followers/ids',
		method: 'GET'
	});


	/* Friendships */

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/friendships.create
	N({
		name: 'addFriend',
		action: 'friendships/create',
		method: 'POST',
		argsProcessor: completeTweetParams
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/friendships.destroy
	N({
		name: 'removeFriend',
		action: 'friendships/destroy',
		method: 'POST',
		argsProcessor: completeTweetParams
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/friendships.accept
	N({
		name: 'acceptFriend',
		action: 'friendships/accept',
		method: 'POST',
		argsProcessor: completeTweetParams
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/friendships.deny
	N({
		name: 'rejectFriend',
		action: 'friendships/deny',
		method: 'POST',
		argsProcessor: completeTweetParams
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/friendships.exists
	N({
		name: 'isFollowing',
		action: 'friendships/exists',
		method: 'GET',
		argsProcessor: function(a, b) {
			var params = {
				user_a: a,
				user_b: b
			};
			return params;
		}
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/friendships.requests
	N({
		name: 'getFriendRequests',
		action: 'friendships/requests',
		method: 'GET',
		argsProcessor: completeTweetParams
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/friendships.show
	N({
		name: 'showRelationship',
		action: 'friendships/show',
		method: 'GET'
	});

	N({
		name: 'showRelationshipById',
		packer: function(source, target) {
			var params = {
				source_id: source,
				target_id: target
			};
			return this.showRelationship(params);
		}
	});

	N({
		name: 'showRelationshipByLoginName',
		packer: function(source, target) {
			var params = {
				source_login_name: source,
				target_login_name: target
			};
			return this.showRelationship(params);
		}
	});

	/* Blocks */

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/blocks.create
	N({
		name: 'createBlock',
		action: 'blocks/create',
		method: 'POST',
		argsProcessor: completeTweetParams
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/blocks.destroy
	N({
		name: 'destroyBlock',
		action: 'blocks/destroy',
		method: 'POST',
		argsProcessor: completeTweetParams
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/blocks.exists
	N({
		name: 'isBlocking',
		action: 'blocks/exists',
		method: 'GET',
		argsProcessor: completeTweetParams
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/blocks.blocking
	N({
		name: 'getBlockingList',
		action: 'blocks/blocking',
		method: 'GET',
		argsProcessor: completeTweetParams
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/blocks.ids
	N({
		name: 'getBlockingIdList',
		action: 'blocks/ids',
		method: 'GET',
		argsProcessor: completeTweetParams
	});


	/* Favorites */

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/favorites
	N({
		name: 'getFavorites',
		action: 'favorites/{:id}',
		method: 'GET',
		argsProcessor: function(params) {
			params.id = params.id || this.id;
			return completeTweetParams(params);
		},
		urlProcessor: idReplacer
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/favorites.create
	N({
		name: 'addFavorite',
		action: 'favorites/create/{:id}',
		method: 'POST',
		argsProcessor: completeTweetParams,
		urlProcessor: idReplacer
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/favorites.destroy
	N({
		name: 'removeFavorite',
		action: 'favorites/destroy/{:id}',
		method: 'POST',
		argsProcessor: completeTweetParams,
		urlProcessor: idReplacer
	});


	/* Trends */

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/trends.list
	N({
		name: 'getTrends',
		action: 'trends/list',
		method: 'GET'
	});


	/* Search */

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/search.public-timeline
	N({
		name: 'searchPublicTimeline',
		action: 'search/public_timeline',
		method: 'GET',
		argsProcessor: completeTweetParams
	}, { success: _processTweets });

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/search.user-timeline
	N({
		name: 'searchUserTimeline',
		action: 'search/user_timeline',
		method: 'GET',
		argsProcessor: completeTweetParams
	}, { success: _processTweets });

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/search.users
	N({
		name: 'searchUser',
		action: 'search/users',
		method: 'GET'
	});


	/* Saved Searches */

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/saved-searches.show
	N({
		name: 'showSavedSearch',
		action: 'saved_searches/show',
		method: 'GET'
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/saved-searches.list
	N({
		name: 'getSavedSearches',
		action: 'saved_searches/list',
		method: 'GET'
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/saved-searches.destroy
	N({
		name: 'destroySavedSearch',
		action: 'saved_searches/destroy',
		method: 'POST'
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/saved-searches.create
	N({
		name: 'createSavedSearch',
		action: 'saved_searches/create',
		method: 'POST'
	});


	/* Users */

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/users.show
	N({
		name: 'showUser',
		action: 'users/show',
		method: 'GET',
		argsProcessor: completeTweetParams
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/users.tag-list
	N({
		name: 'getTagList',
		action: 'users/tag_list',
		method: 'GET'
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/users.friends
	N({
		name: 'getLatestLoggedFriends',
		action: 'users/friends',
		method: 'GET',
		argsProcessor: completeTweetParams
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/users.followers
	N({
		name: 'getLatestLoggedFollowers',
		action: 'users/followers',
		method: 'GET',
		argsProcessor: completeTweetParams
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/users.cancel-recommendation
	N({
		name: 'cancelRecommendation',
		action: '2/users/cancel_recommendation',
		method: 'POST',
		argsProcessor: completeTweetParams
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/users.recommendation
	N({
		name: 'getRecommendations',
		action: '2/users/recommendation',
		method: 'GET',
		argsProcessor: completeTweetParams
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/users.tagged
	N({
		name: 'getTaggedUsers',
		action: 'users/tagged',
		method: 'GET',
		argsProcessor: completeTweetParams
	});


	/* Account */

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/account.notification
	N({
		name: 'getNotification',
		action: 'account/notification',
		method: 'GET'
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/account.rate-limit-status
	N({
		name: 'getRateLimit',
		action: 'account/rate_limit_status',
		method: 'GET'
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/account.update-profile
	N({
		name: 'updateProfile',
		action: 'account/update_profile',
		method: 'POST',
		argsProcessor: completeTweetParams
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/account.update-profile-image
	N({
		name: 'updateAvatar',
		action: 'account/update_profile_image',
		method: 'POST',
		argsProcessor: function(params) {
			if (! H.isObject(params)) {
				params = { image: params };
			}
			completeTweetParams(params);
			return params;
		}
	}, { urlEncoded: false });

	//https://github.com/FanfouAPI/FanFouAPIDoc/wiki/account.notify-num
	N({
		name: 'getNotifyNum',
		action: 'account/notify_num',
		method: 'GET'
	});

	//https://github.com/FanfouAPI/FanFouAPIDoc/wiki/account.update-notify-num
	N({
		name: 'updateNotifyNum',
		action: 'account/update_notify_num',
		method: 'POST'
	});

	// https://github.com/FanfouAPI/FanFouAPIDoc/wiki/account.verify-credentials
	N({
		name: 'verify',
		action: 'account/verify_credentials',
		method: 'POST',
		argsProcessor: completeTweetParams
	});

})(Ripple);