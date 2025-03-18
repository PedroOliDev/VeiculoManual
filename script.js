let marchaAtual = 1;
let velocidade = 0;
let rpm = 0;
let embreagemPressionada = false;

const marchaAtualElement = document.getElementById('marcha-atual');
const velocidadeElement = document.getElementById('velocidade');
const rpmElement = document.getElementById('rpm');
const carroElement = document.getElementById('carro');

const acelerarButton = document.getElementById('acelerar');
const frearButton = document.getElementById('frear');
const aumentarMarchaButton = document.getElementById('aumentar-marcha');
const reduzirMarchaButton = document.getElementById('reduzir-marcha');
const embreagemButton = document.getElementById('embreagem');

// Configuração do gráfico
const ctx = document.getElementById('grafico-velocidade-rpm').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Velocidade (km/h)',
                borderColor: 'blue',
                data: [],
            },
            {
                label: 'RPM',
                borderColor: 'red',
                data: [],
            },
        ],
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    },
});

// Função para atualizar o painel e mover o carro
function atualizarPainel() {
    marchaAtualElement.textContent = marchaAtual;
    velocidadeElement.textContent = velocidade.toFixed(1);
    rpmElement.textContent = rpm.toFixed(0);

    // Move o carro
    const estradaWidth = document.querySelector('.estrada').offsetWidth;
    const carroWidth = carroElement.offsetWidth;
    const novaPosicao = (velocidade / 100) * (estradaWidth - carroWidth);
    carroElement.style.left = `${novaPosicao}px`;

    // Atualiza o gráfico
    chart.data.labels.push(new Date().toLocaleTimeString());
    chart.data.datasets[0].data.push(velocidade);
    chart.data.datasets[1].data.push(rpm);
    if (chart.data.labels.length > 10) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
        chart.data.datasets[1].data.shift();
    }
    chart.update();
}

// Função para acelerar
function acelerar() {
    if (marchaAtual === 0) {
        alert("Coloque uma marcha para acelerar!");
        return;
    }
    velocidade += 5 / marchaAtual; // A velocidade aumenta conforme a marcha
    rpm += 300; // Aumenta o RPM
    if (rpm > 7000) {
        alert("Cuidado! RPM muito alto!");
        rpm = 7000; // Limita o RPM
    }
    if (velocidade > 200) velocidade = 200; // Limita a velocidade
}

// Função para frear
function frear() {
    if (velocidade > 0) {
        velocidade -= 5;
        rpm -= 500;
        if (velocidade < 0) velocidade = 0;
        if (rpm < 0) rpm = 0;
    }
}

// Função para aumentar a marcha
function aumentarMarcha() {
    if (!embreagemPressionada) {
        alert("Pise na embreagem para trocar de marcha!");
        return;
    }
    if (marchaAtual < 5) {
        if (rpm < 800 || rpm > 5000) {
            alert("RPM fora da faixa ideal para trocar de marcha!");
            return;
        }
        marchaAtual++;
        rpm -= 1500; // Reduz o RPM ao trocar de marcha
        rpm = 0;
            } else {
            alert("Já está na marcha máxima!");
        }

        // Adiciona o freio de mão
        let freioDeMaoPuxado = true;

        // Função para alternar o freio de mão
        function toggleFreioDeMao() {
            freioDeMaoPuxado = !freioDeMaoPuxado;
            document.getElementById('freio-de-mao').textContent = freioDeMaoPuxado ? "Soltar Freio de Mão" : "Puxar Freio de Mão";
            if (freioDeMaoPuxado) {
                velocidade = 0; // Para o carro ao puxar o freio de mão
                rpm = 0;
            }
        }

        // Modifica a lógica para impedir a troca de marcha com o freio de mão puxado
        function aumentarMarcha() {
            if (freioDeMaoPuxado) {
                alert("Solte o freio de mão para trocar de marcha!");
                return;
            }
            if (!embreagemPressionada) {
                alert("Pise na embreagem para trocar de marcha!");
                return;
            }
            if (marchaAtual < 5) {
                if (rpm < 800 || rpm > 5000) {
                    alert("RPM fora da faixa ideal para trocar de marcha!");
                    return;
                }
                marchaAtual++;
                rpm -= 1500; // Reduz o RPM ao trocar de marcha
                if (rpm < 0) rpm = 0;
            } else {
            alert("Já está na marcha máxima!");
        }

        // Inicializa a marcha em ponto morto
        marchaAtual = 0;
        marchaAtualElement.textContent = marchaAtual;

        // Event listener para o freio de mão
        document.getElementById('freio-de-mao').addEventListener('click', toggleFreioDeMao);
        alert("Já está na marcha máxima!");
    }
}

// Função para reduzir a marcha
function reduzirMarcha() {
    if (!embreagemPressionada) {
        alert("Pise na embreagem para trocar de marcha!");
        return;
    }
    if (marchaAtual > 1) {
        if (rpm < 1000 || rpm > 5000) {
            alert("RPM fora da faixa ideal para trocar de marcha!");
            return;
        }
        marchaAtual--;
        rpm += 1000; // Aumenta o RPM ao reduzir a marcha
        if (rpm > 7000) rpm = 7000;
    } else {
        alert("Já está na marcha mínima!");
    }
}

// Função para pressionar/soltar a embreagem
function toggleEmbreagem() {
    embreagemPressionada = !embreagemPressionada;
    embreagemButton.textContent = embreagemPressionada ? "Soltar Embreagem" : "Embreagem";
    aumentarMarchaButton.disabled = !embreagemPressionada;
    reduzirMarchaButton.disabled = !embreagemPressionada;
}

// Loop de animação para atualizar o carro continuamente
function animar() {
    // Reduz a velocidade gradualmente (simula resistência do ar e atrito)
    if (velocidade > 0) {
        velocidade -= 0.1;
        rpm -= 10;
        if (velocidade < 0) velocidade = 0;
        if (rpm < 0) rpm = 0;
    }
    if (velocidade === 0) {
        rpm = 0;
    }


    // Atualiza o painel e o gráfico
    atualizarPainel();

    // Chama a próxima animação
    requestAnimationFrame(animar);
}

// Event listeners
acelerarButton.addEventListener('click', acelerar);
frearButton.addEventListener('click', frear);
aumentarMarchaButton.addEventListener('click', aumentarMarcha);
reduzirMarchaButton.addEventListener('click', reduzirMarcha);
embreagemButton.addEventListener('click', toggleEmbreagem);

// Inicia o loop de animação
animar();