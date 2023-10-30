package puj.backend_gui_nodules.rest;

import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import puj.backend_gui_nodules.domain.Parameter;
import puj.backend_gui_nodules.domain.User;
import puj.backend_gui_nodules.domain.UserType;
import puj.backend_gui_nodules.model.ParameterDTO;
import puj.backend_gui_nodules.repos.ParameterRepository;
import puj.backend_gui_nodules.repos.UserRepository;
import puj.backend_gui_nodules.service.ParameterService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
@ExtendWith(MockitoExtension.class)
public class ParameterResourceTest {

    @Mock
    private ParameterRepository parameterRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ParameterService parameterService;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testGetAllParametros() {
        List<Parameter> parameters = Mockito.mock(List.class);
        when(parameterRepository.findAll()).thenReturn(parameters);

        List saveParameters = parameterService.findAll();

        Assertions.assertThat(saveParameters).isNotNull();
    }

    @Test
    public void testGetByIdParameter() {
        int parameterId = 1;
        Parameter parameter = Parameter.builder()
                .id(1)
                .parametro("pikachu")
                .valor("electric")
                .descripcion("algo")
                .userModifica(User.builder()
                        .id(1)
                        .tipoUsuario(UserType.builder().build())
                        .apellido("Rojas")
                        .nombre("Esteban")
                        .pass("esteban123")
                        .telefono("321654752")
                        .username("esrojas27")
                        .build()).build();
        when(parameterRepository.findById(parameterId)).thenReturn(Optional.ofNullable(parameter));

        ParameterDTO parameterReturn = parameterService.get(parameterId);

        Assertions.assertThat(parameterReturn).isNotNull();
    }

    @Test
    public void testDeleteByIdParameter() {
        int parameterID = 1;
        Parameter parameter = Parameter.builder()
                .id(1)
                .parametro("pikachu")
                .valor("electric")
                .descripcion("algo")
                .userModifica(User.builder()
                        .id(1)
                        .tipoUsuario(UserType.builder().build())
                        .apellido("Rojas")
                        .nombre("Esteban")
                        .pass("esteban123")
                        .telefono("321654752")
                        .username("esrojas27")
                        .build()).build();
        when(parameterRepository.findById(parameterID)).thenReturn(Optional.ofNullable(parameter));
        doNothing().when(parameterRepository).delete(parameter);

        assertAll(() -> parameterService.delete(parameterID));
    }



}