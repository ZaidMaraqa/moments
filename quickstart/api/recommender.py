import pandas as pd
from surprise import Dataset, Reader
from surprise import KNNBasic
from surprise.model_selection import train_test_split

from quickstart.models import Post, customUser


def get_user_post_data():
    user_post_data = []

    for post in Post.objects.all():
        for user in post.likes.all():
            user_post_data.append({
                'user_id': user.id,
                'post_id': post.id,
                'rating': 1,  # User has liked the post, so the rating is 1
            })

    return pd.DataFrame(user_post_data)



def get_recommendations(request, user_id, n_recommendations=10):
    user_post_data = get_user_post_data()

    reader = Reader(rating_scale=(0, 1))
    data = Dataset.load_from_df(user_post_data, reader)
    trainset = data.build_full_trainset()

    sim_options = {
        'name': 'cosine',
        'user_based': True
    }

    algo = KNNBasic(sim_options=sim_options)
    algo.fit(trainset)

    all_posts = [post.id for post in Post.objects.all()]

    rated_posts = user_post_data[user_post_data['user_id'] == user_id]['post_id'].tolist()
    unrated_posts = list(set(all_posts) - set(rated_posts))

    post_estimates = []
    for post_id in unrated_posts:
        est = algo.predict(user_id, post_id).est
        post_estimates.append((post_id, est))

    post_estimates.sort(key=lambda x: x[1], reverse=True)

    recommended_posts = post_estimates[:n_recommendations]
    recommended_post_ids = [post_id for post_id, _ in recommended_posts]

    followed_users = request.user.following.all()

    # Get blocked users
    blocked_users = request.user.blocked_users.all()

    # Create a set of user IDs to exclude
    exclude_user_ids = set([user.id for user in followed_users] + [user.id for user in blocked_users])

    # Filter out posts from followed and blocked users
    filtered_posts = Post.objects.filter(id__in=recommended_post_ids).exclude(user_id__in=exclude_user_ids)

    return filtered_posts
