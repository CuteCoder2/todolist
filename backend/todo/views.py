from rest_framework.views import (APIView)
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from rest_framework import status
from django.shortcuts import get_object_or_404
from . serializers import TodoSerializer
from . models import Todo


class TodoView(APIView):
    serializer_class = TodoSerializer
    model = Todo
    queryset = Todo.objects.all()

    def get_object(self, id):
        return get_object_or_404(self.queryset, id=id)

    def get(self, request):
        serialized_data = self.serializer_class(
            self.model.objects.all(), many=True).data
        return Response(data=serialized_data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        name = data['name']
        todo = self.model.objects.create(name=name, status="pen")
        serialized_data = self.serializer_class(instance=todo).data
        return Response(data=serialized_data, status=status.HTTP_201_CREATED)

    def delete(self, request):
        data = request.data
        object = self.get_object(data['id'])
        if (not object.delete()):
            raise APIException(
                code=status.HTTP_424_FAILED_DEPENDENCY, detail={'status': status.HTTP_424_FAILED_DEPENDENCY, 'deleted': 'no'})
        return Response(data={'status': status.HTTP_200_OK, 'deleted': 'yes'}, status=status.HTTP_200_OK)

    def put(self, request):
        data = request.data
        todo = self.get_object(data['data']['id'])
        todo.status = data['data']['status']
        todo.save()
        serialized_data = self.serializer_class(instance=todo).data
        return Response(data=serialized_data, status=status.HTTP_200_OK)
