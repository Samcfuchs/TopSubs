# %%
import praw
from collections import Counter
import requests

# %%
r = praw.Reddit('topsubsbot')
URL = "/api/user/hoodedgryphon/comments"

r.get(URL)

# %%
user = "hoodedgryphon"
comments = r.redditor(user).comments.new(limit=None)
subreddits = [c.subreddit for c in comments]
counts = Counter(subreddits)
counts

