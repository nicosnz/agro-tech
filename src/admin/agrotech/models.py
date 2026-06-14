from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
import uuid

class TimeStampedMixin(models.Model):
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True

class UUIDMixin(models.Model):
    id=models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    
    class Meta:
        abstract=True
        
class Medicamentos(UUIDMixin,TimeStampedMixin):
    nombre=models.CharField(db_column="nombre",max_length=100,null=False)
    dosis_recomendada=models.CharField(max_length=100,null=False)
    descripcion=models.TextField(db_column="descripcion",null=True)
    precio=models.DecimalField(db_column="precio",max_digits=10,decimal_places=2,validators=[MinValueValidator(Decimal('0.01'))])
    disponible=models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.nombre}, Dosis: {self.dosis_recomendada}"
    
    class Meta:
        managed=False
        db_table='"content"."medicamento"'
        verbose_name="Medicamento"
        verbose_name_plural="Medicamentos"