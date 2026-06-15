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
    precio=models.DecimalField(db_column="precio",max_digits=10,decimal_places=2,validators=[MinValueValidator(Decimal('0.01'))],help_text="Bs.")
    disponible=models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre}, Dosis: {self.dosis_recomendada}"
    
    class Meta:
        managed=False
        db_table='"content"."medicamento"'
        verbose_name="Medicamento"
        verbose_name_plural="Medicamentos"
        
class TipoAlimentos(UUIDMixin,TimeStampedMixin):
    nombre=models.CharField(db_column="nombre",max_length=100,null=False,unique=True)
    descripcion=models.TextField(db_column="descripcion",null=True)
    precio=models.DecimalField(db_column="precio",max_digits=10,decimal_places=2,validators=[MinValueValidator(Decimal('0.01'))],help_text="Bs.")
    cantidad_restante=models.DecimalField(db_column="cantidad_restante",max_digits=10,decimal_places=2,validators=[MinValueValidator(Decimal('0.01'))],help_text="kg")
    disponible=models.BooleanField(default=True)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        managed=False
        db_table='"content"."tipoalimento"'
        verbose_name="Tipo de Alimento"
        verbose_name_plural="Tipo de Alimentos"
        
class Potreros(UUIDMixin,TimeStampedMixin):
    ESTADOS = [
        ("Disponible", "Disponible"),
        ("Ocupado", "Ocupado"),
        ("En descando", "En descanso"),
        ("Inactivo", "Inactivo")
    ]
    nombre=models.CharField(db_column="nombre",max_length=100,null=False,unique=True)
    capacidad=models.IntegerField(validators=[MinValueValidator(1)],db_column="capacidad",null=False)
    ubicacion=models.CharField(db_column="ubicacion",null=False,max_length=200)
    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default='Disponible'
    )
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        managed=False
        db_table='"content"."potrero"'
        verbose_name="Potrero"
        verbose_name_plural="Potreros"
        
class Lotes(UUIDMixin,TimeStampedMixin):
    TIPOS = [
        ("Nacimiento", "Nacimiento"),
        ("Recria", "Recria"),
        ("Engore", "Engorde")
    ]
    nombre=models.CharField(db_column="nombre",max_length=100,null=False,unique=True)
    tipo = models.CharField(
        max_length=20,
        choices=TIPOS,
    )
    cantidad_animales=models.IntegerField(validators=[MinValueValidator(1)],db_column="cantidad_animales",null=False)
    fecha_creacion = models.DateField(null=False)
    activo=models.BooleanField(default=True)
    potrero = models.ForeignKey("Potreros",on_delete=models.PROTECT,db_column="id_potrero",related_name="lote")
    def __str__(self):
        return self.nombre
    
    class Meta:
        managed=False
        db_table='"content"."lote"'
        verbose_name="Lote"
        verbose_name_plural="Lotes"