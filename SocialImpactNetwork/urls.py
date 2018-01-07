"""ProblemSolverCentral URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from rest_framework import routers

from SocialImpactNetwork.views import *
from authentication.views import is_social_account

router = routers.DefaultRouter()
router.register(r'pledge_project', PledgeProject, base_name="create_project")
router.register(r'pledge_skill', PledgeSkill, base_name="create_skill")
router.register(r'pledge_network', PledgeNetwork, base_name="create_network")
router.register(r'all_resource_types', AllResourceTypesViewSet)
router.register(r'all_categories', AllCategoriesViewSet)
router.register(r'get_all_countries', CountryViewSet)
router.register(r'get_all_cities', CityViewSet)
router.register(r'projects', ProjectsViewSet, base_name="retrieve-project")
router.register(r'networks', PledgeNetwork)
router.register(r'skills', PledgeSkill)
router.register(r'answers', ContactQuestionAnswerViewSet, base_name="list-answers")

urlpatterns = [

    url(r'^api/$', include(router.urls)),
    url(r'^$', Index.as_view(), name='social_network'),
    url(r'^search/$', SocialNetworkSearchAPI.as_view(), name='search'),
    url(r'^get_questions/$', ContactQuestionViewSet.as_view({'post': 'list'}), name='get_questions'),
    url(r'^add_message/$', ChatViewSet.as_view({'post': 'create'}), name='add_message'),
    url(r'^get_chat/$', ChatViewSet.as_view({'post': 'list'}), name='get_chat'),
    url(r'^create_lounge_area/$', LoungeAreaViewSet.as_view({'post': 'create'}), name='create_lounge_area'),
    url(r'^get_lounge_area/$', LoungeAreaViewSet.as_view({'post': 'retrieve'}), name='get_lounge_area'),
    url(r'^lounge_area_requests/$', LoungeAreaMemberViewSet.as_view({'post': 'list'}), name='lounge_area_requests'),
    url(r'^lounge_area_request/$', LoungeAreaMemberViewSet.as_view({'post': 'retrieve'}), name='lounge_area_request'),
    url(r'^update_lounge_area_requests/$', LoungeAreaMemberViewSet.as_view({'post': 'update'}),
        name='update_lounge_area_requests'),
    url(r'^create_lounge_area_member/$', LoungeAreaMemberViewSet.as_view({'post': 'create'}),
        name='create_lounge_area_member'),
    url(r'^get_countries/$', CountryViewSet.as_view({'post': 'list'}), name='get_countries'),
    url(r'^get_cities/$', CityViewSet.as_view({'post': 'list'}), name='get_cities'),
    url(r'^get_contact/$', PledgeContact.as_view({'post': 'retrieve'}), name='get_contact'),
    url(r'^get_user_projects/$', PledgeProject.as_view({'post': 'list'}), name='get_user_projects'),
    url(r'^all_user_categories/$', AllUserCategoriesViewSet.as_view({'get': 'list'}), name='all_user_categories'),
    url(r'^all_user_projects/$', AllUserProjectsViewSet.as_view({'get': 'list'}), name='all_user_projects'),
    url(r'^all_user_networks/$', AllUserNetworksViewSet.as_view({'get': 'list'}), name='all_user_networks'),
    url(r'^all_user_skills/$', PledgeSkill.as_view({'get': 'list'}), name='get_user_skills'),
    url(r'^get_user_networks/$', PledgeNetwork.as_view({'post': 'list'}), name='get_user_networks'),
    url(r'^update_project/$', PledgeProject.as_view({'post': 'update'}), name='update_project'),
    url(r'^delete_project/$', PledgeProject.as_view({'post': 'destroy'}), name='delete_project'),
    # url(r'^projects/(\d+)$', PledgeProject.as_view({'get': 'retrieve'}), name='projects'),
    url(r'^update_network/$', PledgeNetwork.as_view({'post': 'update'}), name='update_network'),
    url(r'^delete_network/$', PledgeNetwork.as_view({'post': 'destroy'}), name='delete_network'),
    url(r'^update_skill/$', PledgeSkill.as_view({'post': 'update'}), name='update_skill'),
    url(r'^delete_skill/$', PledgeSkill.as_view({'post': 'destroy'}), name='delete_skill'),
    url(r'^affiliations/(\d+)$', get_affiliations, name='affiliations'),
    url(r'^submit_contact_form/$', submit_contact_form, name='submit_contact_form'),
    url(r'^is_social_account/$', is_social_account, name='is_social_account'),

]

urlpatterns += router.urls

