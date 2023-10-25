package puj.backend_gui_nodules.rest;

import puj.backend_gui_nodules.model.ParameterDTO;
import puj.backend_gui_nodules.service.ParameterService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "/api-ms-admon/parametros", produces = MediaType.APPLICATION_JSON_VALUE)
public class ParameterResource {

    private final ParameterService parameterService;

    public ParameterResource(final ParameterService parameterService) {
        this.parameterService = parameterService;
    }

    @GetMapping
    public ResponseEntity<List<ParameterDTO>> getAllParametros() {
        return ResponseEntity.ok(parameterService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParameterDTO> getParametro(@PathVariable final Integer id) {
        return ResponseEntity.ok(parameterService.get(id));
    }

    @PostMapping
    public ResponseEntity<Integer> createParametro(
            @RequestBody @Valid final ParameterDTO parameterDTO) {
        final Integer createdId = parameterService.create(parameterDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateParametro(@PathVariable final Integer id,
            @RequestBody @Valid final ParameterDTO parameterDTO) {
        parameterService.update(id, parameterDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParametro(@PathVariable final Integer id) {
        parameterService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
