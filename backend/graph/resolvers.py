from .types import query


@query.field("getCurrentUser")
def current_user_resolver(_, info, **kwargs):
    user = info.context["request"].user
    return {"id": user.pk, "email": user.email}


@query.field("getSomeData")
def get_some_data(_, info, **kwargs):
    return {"names": ["hello", "world", "foo", "bar", "baz"]}
