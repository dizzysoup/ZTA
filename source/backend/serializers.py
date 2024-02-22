from rest_framework import serializers
from backend.models import Mechine


class MechineuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mechine
        # fields = '__all__'
        fields = ('name', 'member', 'last_modify_date', 'created')
