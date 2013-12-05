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
		include_entities: true,
		trim_user: false
	});

	var H = R.helpers,
		E = R.events,
		G = R.getConfig,
		N = R.registerAPI;

	function completeTweetParams(params) {
		params = params || {};
		if (params.include_entities === undefined) {
			params.include_entities = G('include_entities');
		}
		if (params.trim_user === undefined) {
			params.trim_user = G('trim_user');
		}
		return params;
	}

	function processTweet(event_type, tweet) {
		var event = { actionType: event_type };
		tweet = E.triggerWith(this, 'process_tweet', tweet, event);
		tweet = E.triggerWith(this, event_type, tweet, event);
		return tweet;
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
		action: 'statuses/show',
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
		action: 'statuses/update',
		method: 'POST',
		argsProcessor: completeTweetParams
	}, { success: _processTweet });

	// https://dev.twitter.com/docs/api/1.1/post/statuses/retweet/%3Aid
	N({
		name: 'retweet',
		action: 'statuses/retweet/{:id}',
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
	}, {
		urlEncoded: false,
		success: _processTweet
	});

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
	}, { success: function(data, event) {
		processTweets.call(this, event.actionType, data.statuses);
		return data;
	} });


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
	}, { success: _processTweets });

	// https://dev.twitter.com/docs/api/1.1/get/direct_messages/sent
	N({
		name: 'getSentDirectMessages',
		action: 'direct_messages/sent',
		method: 'GET',
		argsProcessor: completeTweetParams
	}, { success: _processTweets });

	// https://dev.twitter.com/docs/api/1.1/get/direct_messages/show
	N({
		name: 'showDirectMessage',
		action: 'direct_messages/show',
		method: 'GET'
	}, { success: _processTweet });

	// https://dev.twitter.com/docs/api/1.1/post/direct_messages/destroy
	N({
		name: 'destroyDirectMessage',
		action: 'direct_messages/destroy',
		method: 'POST',
		argsProcessor: completeTweetParams
	}, { success: _processTweet });

	// https://dev.twitter.com/docs/api/1.1/post/direct_messages/new
	N({
		name: 'createDirectMessage',
		action: 'direct_messages/new',
		method: 'POST'
	}, { success: _processTweet });


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
		name: 'getLists',
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

	// https://dev.twitter.com/docs/api/1.1/post/lists/members/destroy
	N({
		name: 'removeMemberFromList',
		action: 'lists/members/destroy',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/get/lists/memberships
	N({
		name: 'getListsListByUser',
		action: 'lists/memberships',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/lists/subscribers
	N({
		name: 'getListSubscribers',
		action: 'lists/subscribers',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/post/lists/subscribers/create
	N({
		name: 'subscribeToList',
		action: 'lists/subscribers/create',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/get/lists/subscribers/show
	N({
		name: 'showIfIsSubscriber',
		action: 'lists/subscribers/show',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/post/lists/subscribers/destroy
	N({
		name: 'unsubscribeToList',
		action: 'lists/subscribers/destroy',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/post/lists/members/create_all
	N({
		name: 'addAllMembersToList',
		action: 'lists/members/create_all',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/get/lists/members/show
	N({
		name: 'showIfIsMemberOfList',
		action: 'lists/members/show',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/lists/members
	N({
		name: 'getListMembers',
		action: 'lists/members',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/post/lists/members/create
	N({
		name: 'addMemberToList',
		action: 'lists/members/create',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/post/lists/destroy
	N({
		name: 'deleteList',
		action: 'lists/destroy',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/post/lists/update
	N({
		name: 'updateList',
		action: 'lists/update',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/post/lists/create
	N({
		name: 'createList',
		action: 'lists/create',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/get/lists/show
	N({
		name: 'getList',
		action: 'lists/show',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/lists/subscriptions
	N({
		name: 'getSubscribedLists',
		action: 'lists/subscriptions',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/post/lists/members/destroy_all
	N({
		name: 'removeMembersFromList',
		action: 'lists/members/destroy_all',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/get/lists/ownerships
	N({
		name: 'getOwnedLists',
		action: 'lists/ownerships',
		method: 'GET'
	});


	/* Saved Searches */

	// https://dev.twitter.com/docs/api/1.1/get/saved_searches/list
	N({
		name: 'getSavedSearches',
		action: 'saved_searches/list',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/saved_searches/show/%3Aid
	N({
		name: 'showSavedSearch',
		action: 'saved_searches/show/{:id}',
		method: 'GET',
		urlProcessor: idReplacer
	});

	// https://dev.twitter.com/docs/api/1.1/post/saved_searches/create
	N({
		name: 'createSavedSearch',
		action: 'saved_searches/create',
		method: 'POST'
	});

	// https://dev.twitter.com/docs/api/1.1/post/saved_searches/destroy/%3Aid
	N({
		name: 'removeSavedSearch',
		action: 'saved_searches/destroy/{:id}',
		method: 'POST',
		urlProcessor: idReplacer
	});


	/* Places & Geo */

	// https://dev.twitter.com/docs/api/1.1/get/geo/id/%3Aplace_id
	N({
		name: 'getPlaceInformation',
		action: 'geo/id/{:place_id}',
		method: 'GET',
		urlProcessor: function(url, params) {
			return url.replace('{:place_id}, params.place_id');
		}
	});

	// https://dev.twitter.com/docs/api/1.1/get/geo/reverse_geocode
	N({
		name: 'reverseGeocode',
		action: 'geo/reverse_geocode',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/geo/search
	N({
		name: 'searchPlaces',
		action: 'geo/search',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/geo/similar_places
	N({
		name: 'searchSimilarPlaces',
		action: 'geo/similar_places',
		method: 'GET'
	});


	/* Trends */

	// https://dev.twitter.com/docs/api/1.1/get/trends/place
	N({
		name: 'getTrendsForPlace',
		action: 'trends/place',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/trends/available
	N({
		name: 'getAvailableLocations',
		action: 'trends/available',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/trends/closest
	N({
		name: 'getClosestLocation',
		action: 'trends/closest',
		method: 'GET'
	});


	/* Spam Reporting */

	// https://dev.twitter.com/docs/api/1.1/post/users/report_spam
	N({
		name: 'reportSpam',
		action: 'users/report_spam',
		method: 'POST'
	});


	/* Help */

	// https://dev.twitter.com/docs/api/1.1/get/help/configuration
	N({
		name: 'getConfiguration',
		action: 'help/configuration',
		method: 'GET'
	});

	//  https://dev.twitter.com/docs/api/1.1/get/help/languages
	N({
		name: 'getSupportedLanguages',
		action: 'help/languages',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/help/privacy
	N({
		name: 'getPrivacyPolicy',
		action: 'help/privacy',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/help/tos
	N({
		name: 'getTermsOfService',
		action: 'help/tos',
		method: 'GET'
	});

	// https://dev.twitter.com/docs/api/1.1/get/application/rate_limit_status
	N({
		name: 'getRateLimitStatus',
		action: 'application/rate_limit_status',
		method: 'GET'
	});


})(Ripple);